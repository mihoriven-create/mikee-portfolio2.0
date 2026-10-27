/*
 * Scroll-driven background scene.
 *
 * Architecture and several techniques are adapted from ThreeUI's "Kage" landing page
 * (Community / MIT — see THIRD_PARTY_NOTICES.md): the section-anchor scroll mapping
 * (measure / progressFor), frame-rate-independent damping, the Catmull-Rom camera rig
 * with aspect fitting, intro dolly and pointer parallax, the rising-mote shader, drifting
 * haze slabs, the bloom chain and composite shader, and the frame-time quality governor.
 * The world itself (blueprint floor, signal network, horizon light) is original to this site.
 *
 * One controller drives everything: scroll position → continuous progress (in keyframe
 * units) → damped progress → camera + environment. Scrolling back reverses it exactly.
 */
import * as THREE from "three";
import { SCENES, type Env, type Keyframe } from "./scenes";

/* ── helpers (from Kage) ─────────────────────────────────────────────── */
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const sat = (v: number) => clamp(v, 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = sat((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const damp = (cur: number, to: number, rate: number, dt: number) => lerp(cur, to, 1 - Math.exp(-rate * dt));
const TAU = Math.PI * 2;
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function texGlow(inner: string, mid: string) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.28, mid);
  g.addColorStop(0.62, "rgba(255,255,255,.07)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}
const vpW = () => document.documentElement.clientWidth || innerWidth;
const vpH = () => document.documentElement.clientHeight || innerHeight;

/* Exponential-squared fog, computed in each shader so every layer shares one atmosphere. */
const FOG_GLSL = /* glsl */ `
uniform float uFogD; uniform vec3 uFogC;
float fogAmt(float depth){ float d = uFogD * depth; return 1.0 - exp(-d * d); }
`;

/* Kage boots in small jobs with a yield between each; this does the same so building the
   world never blocks input for long. */
const job = () => new Promise<void>((r) => setTimeout(r, 0));

const QUAD_VS = "varying vec2 vUv;\nvoid main(){ vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }";

export type SceneHandle = { dispose: () => void };

/** Not started under prefers-reduced-motion (see SceneCanvas): a camera travelling with the scroll is the motion that setting asks to avoid. */
export async function startScene(canvas: HTMLCanvasElement): Promise<SceneHandle> {
  const COARSE = matchMedia("(hover: none)").matches;
  const LOW = COARSE || (navigator.hardwareConcurrency || 8) <= 4;
  const DPR_CAP = LOW ? 1.4 : 1.8;
  const PERF = { scale: 1, acc: 0, n: 0 };
  const FRAME_MIN_MS = 1000 / 30 - 2;
  // governor thresholds, relative to the frame budget (60 fps, or 30 on LOW)
  const SLOW = LOW ? 0.046 : 0.023;
  const FAST = LOW ? 0.036 : 0.0138;

  /* ── renderer ─────────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
  renderer.setSize(vpW(), vpH(), true);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the composite encodes once, at the end
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x05070a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, vpW() / vpH(), 0.35, 420);
  scene.add(camera);

  /* Shared uniforms: every layer reads the same clock and environment. */
  const U = {
    uT: { value: 0 },
    uFogD: { value: 0.02 },
    uFogC: { value: new THREE.Color(0x070b0f) },
    uGrid: { value: 0.5 },
    uNet: { value: 0.5 },
    uPulse: { value: 0.6 },
    uSize: { value: vpH() * 0.5 },
  };
  const SIGNAL = new THREE.Color(0x8be3f7);
  const WARM = new THREE.Color(0xe6d6bd);
  const rnd = mulberry32(1001);
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => (disposables.push(o), o);

  /* ── 1 · blueprint floor with signal pulses running down its lanes ── */
  {
    const mat = track(
      new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader: /* glsl */ `
          varying vec3 vW; varying float vDepth;
          void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz;
            vec4 mv = viewMatrix * w; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: /* glsl */ `
          ${FOG_GLSL}
          uniform float uT, uGrid, uPulse; varying vec3 vW; varying float vDepth;
          float hash(float n){ return fract(sin(n*91.345)*47453.5453); }
          float gline(float c, float w){ float d = abs(fract(c-0.5)-0.5)/fwidth(c); return 1.0-min(d/w,1.0); }
          void main(){
            vec2 p = vW.xz;
            float minor = max(gline(p.x/2.0,1.0), gline(p.y/2.0,1.0));
            float major = max(gline(p.x/10.0,1.15), gline(p.y/10.0,1.15));
            vec3 col = vec3(0.50,0.58,0.64) * (minor*0.07 + major*0.19) * uGrid;
            float lane = floor(p.x/10.0 + 0.5); float h = hash(lane);
            float onLane = gline(p.x/10.0, 1.7) * step(0.55, h);
            float k = fract(-p.y*0.011 - uT*(0.05 + 0.07*h)*uPulse + h*7.0);
            float pulse = pow(k, 22.0) * onLane;
            col += vec3(0.545,0.890,0.969) * pulse * 1.5 * (0.35 + uPulse);
            float f = fogAmt(vDepth);
            gl_FragColor = vec4(mix(col, uFogC, f), 1.0);
          }`,
      }),
    );
    const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(700, 700)), mat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -110);
    scene.add(floor);
  }

  await job();

  /* ── 2 · the signal network: nodes along the route, linked to their nearest neighbours ── */
  const NODES = LOW ? 90 : 170;
  const nodePos: THREE.Vector3[] = [];
  for (let i = 0; i < NODES; i++) {
    const z = 14 - rnd() * 230;
    const side = rnd() < 0.5 ? -1 : 1;
    const x = side * (3 + Math.pow(rnd(), 0.8) * 30);
    nodePos.push(new THREE.Vector3(x, 1.2 + Math.pow(rnd(), 1.4) * 15, z));
  }
  {
    const seg: number[] = [];
    const ends: number[] = [];
    const seeds: number[] = [];
    nodePos.forEach((a, i) => {
      const near = nodePos
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((o) => o.j > i && o.d < 15)
        .sort((m, n) => m.d - n.d)
        .slice(0, 2);
      for (const { j } of near) {
        const b = nodePos[j];
        const s = rnd();
        seg.push(a.x, a.y, a.z, b.x, b.y, b.z);
        ends.push(0, 1);
        seeds.push(s, s);
      }
    });
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    g.setAttribute("aEnd", new THREE.Float32BufferAttribute(ends, 1));
    g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    const lines = new THREE.LineSegments(
      g,
      track(
        new THREE.ShaderMaterial({
          uniforms: U,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: /* glsl */ `
            attribute float aEnd; attribute float aSeed; varying float vEnd; varying float vSeed; varying float vDepth;
            void main(){ vEnd = aEnd; vSeed = aSeed; vec4 mv = modelViewMatrix*vec4(position,1.0); vDepth = -mv.z;
              gl_Position = projectionMatrix*mv; }`,
          fragmentShader: /* glsl */ `
            ${FOG_GLSL}
            uniform float uT, uNet, uPulse; varying float vEnd; varying float vSeed; varying float vDepth;
            void main(){
              float s = fract(uT*uPulse*(0.12 + vSeed*0.22) + vSeed*5.0);
              float pulse = smoothstep(0.10, 0.0, abs(vEnd - s)) * step(0.35, vSeed);
              // fade lines that pass right by the lens so they never slash across the content
              float a = (0.10 + pulse*0.9) * uNet * (1.0 - fogAmt(vDepth)) * smoothstep(2.0, 9.0, vDepth);
              gl_FragColor = vec4(vec3(0.545,0.890,0.969) * a, 1.0);
            }`,
        }),
      ),
    );
    lines.frustumCulled = false;
    scene.add(lines);

    const ng = track(new THREE.BufferGeometry());
    const np = new Float32Array(NODES * 3);
    const ns = new Float32Array(NODES);
    nodePos.forEach((v, i) => {
      np.set([v.x, v.y, v.z], i * 3);
      ns[i] = rnd();
    });
    ng.setAttribute("position", new THREE.BufferAttribute(np, 3));
    ng.setAttribute("aSeed", new THREE.BufferAttribute(ns, 1));
    const nodes = new THREE.Points(
      ng,
      track(
        new THREE.ShaderMaterial({
          uniforms: { ...U, uTex: { value: track(texGlow("rgba(220,248,255,1)", "rgba(139,227,247,.45)")) } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: /* glsl */ `
            attribute float aSeed; uniform float uT; uniform float uSize; varying float vA; varying float vDepth;
            void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vDepth = -mv.z;
              vA = 0.55 + 0.45*sin(uT*(0.6+aSeed) + aSeed*20.0);
              gl_PointSize = uSize*(0.05 + aSeed*0.05)/max(-mv.z, 0.6);
              gl_Position = projectionMatrix*mv; }`,
          fragmentShader: /* glsl */ `
            ${FOG_GLSL}
            uniform sampler2D uTex; uniform float uNet; varying float vA; varying float vDepth;
            void main(){ vec4 t = texture2D(uTex, gl_PointCoord);
              float a = t.a * vA * (0.25 + uNet*0.75) * (1.0 - fogAmt(vDepth));
              gl_FragColor = vec4(t.rgb * a, 1.0); }`,
        }),
      ),
    );
    nodes.frustumCulled = false;
    scene.add(nodes);
  }

  await job();

  /* ── 3 · rising signal motes (Kage's ember shader, recoloured and spread along the route) ── */
  {
    const N = LOW ? 240 : 520;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() - 0.5) * 60;
      pos[i * 3 + 1] = rnd() * 14;
      pos[i * 3 + 2] = 20 - rnd() * 240;
      seed[i] = rnd();
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const motes = new THREE.Points(
      g,
      track(
        new THREE.ShaderMaterial({
          uniforms: { ...U, uTex: { value: track(texGlow("rgba(235,250,255,1)", "rgba(139,227,247,.35)")) } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: /* glsl */ `
            attribute float aSeed; uniform float uT; uniform float uSize; varying float vA; varying float vDepth;
            void main(){ vec3 p = position;
              p.y = mod(p.y + uT*(0.14+aSeed*0.28), 14.5);
              p.x += sin(uT*0.36 + aSeed*22.0)*0.85;
              p.z += cos(uT*0.29 + aSeed*17.0)*0.7;
              vec4 mv = modelViewMatrix*vec4(p,1.0); vDepth = -mv.z;
              vA = (0.25+aSeed*0.75) * smoothstep(14.5,9.0,p.y) * smoothstep(0.0,1.4,p.y);
              gl_PointSize = uSize*(0.010+aSeed*0.020)/max(-mv.z,0.6);
              gl_Position = projectionMatrix*mv; }`,
          fragmentShader: /* glsl */ `
            ${FOG_GLSL}
            uniform sampler2D uTex; varying float vA; varying float vDepth;
            void main(){ vec4 t = texture2D(uTex, gl_PointCoord);
              float a = t.a*vA*0.7*(1.0 - fogAmt(vDepth)*0.85);
              gl_FragColor = vec4(t.rgb*vec3(0.75,1.0,1.08)*a, 1.0); }`,
        }),
      ),
    );
    motes.frustumCulled = false;
    scene.add(motes);
  }

  await job();

  /* ── 4 · haze slabs drifting across the route (Kage) ── */
  const haze: THREE.Mesh[] = [];
  {
    const tex = track(texGlow("rgba(160,205,215,.55)", "rgba(110,165,180,.18)"));
    for (let i = 0; i < (LOW ? 5 : 8); i++) {
      const s = 14 + rnd() * 18;
      const m = new THREE.Mesh(
        track(new THREE.PlaneGeometry(s, s * 0.55)),
        track(
          new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            fog: false,
            opacity: 0.04 + rnd() * 0.06,
          }),
        ),
      );
      m.position.set((rnd() - 0.5) * 46, 2 + rnd() * 10, 6 - (i / (LOW ? 5 : 8)) * 200 - rnd() * 20);
      m.userData = { sp: 0.06 + rnd() * 0.12, ph: rnd() * TAU, x0: m.position.x, base: (m.material as THREE.MeshBasicMaterial).opacity };
      scene.add(m);
      haze.push(m);
    }
  }

  await job();

  /* ── 5 · the horizon light the story travels toward ── */
  const glowTex = track(texGlow("rgba(255,255,255,1)", "rgba(255,255,255,.30)"));
  const glowMat = (opacity: number) =>
    track(
      new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        opacity,
      }),
    );
  const halo = new THREE.Mesh(track(new THREE.PlaneGeometry(150, 150)), glowMat(0.5));
  halo.position.set(0, 16, -270);
  const core = new THREE.Mesh(track(new THREE.PlaneGeometry(26, 26)), glowMat(0.8));
  core.position.set(0, 14, -268);
  const band = new THREE.Mesh(track(new THREE.PlaneGeometry(900, 70)), glowMat(0.3));
  band.position.set(0, 2, -280);
  band.scale.y = 0.35;
  scene.add(halo, core, band);

  await job();

  /* ── post: Kage's bloom chain and composite, plus a readability ceiling ── */
  const POST = {
    cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    quad: new THREE.Mesh(track(new THREE.PlaneGeometry(2, 2))),
    qScene: new THREE.Scene(),
    levels: [] as { a: THREE.WebGLRenderTarget; b: THREE.WebGLRenderTarget; w: number; h: number }[],
    scene: null as unknown as THREE.WebGLRenderTarget,
  };
  POST.quad.frustumCulled = false;
  POST.qScene.add(POST.quad);
  const up = track(
    new THREE.ShaderMaterial({
      uniforms: { tS: { value: null }, uAmt: { value: 1 } },
      vertexShader: QUAD_VS,
      fragmentShader: "uniform sampler2D tS; uniform float uAmt; varying vec2 vUv;\nvoid main(){ gl_FragColor = vec4(texture2D(tS,vUv).rgb*uAmt, 1.0); }",
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const bright = track(
    new THREE.ShaderMaterial({
      uniforms: { tS: { value: null }, uThr: { value: 0.55 }, uKnee: { value: 0.5 } },
      vertexShader: QUAD_VS,
      fragmentShader:
        "uniform sampler2D tS; uniform float uThr; uniform float uKnee; varying vec2 vUv;\n" +
        "void main(){ vec3 c = texture2D(tS, vUv).rgb; float l = dot(c, vec3(0.2126,0.7152,0.0722));\n" +
        " gl_FragColor = vec4(c*smoothstep(uThr, uThr+uKnee, l), 1.0); }",
    }),
  );
  const blur = track(
    new THREE.ShaderMaterial({
      uniforms: { tS: { value: null }, uDir: { value: new THREE.Vector2(1, 0) } },
      vertexShader: QUAD_VS,
      fragmentShader:
        "uniform sampler2D tS; uniform vec2 uDir; varying vec2 vUv;\n" +
        "void main(){ vec3 c = texture2D(tS, vUv).rgb * 0.2270270270;\n" +
        " c += texture2D(tS, vUv + uDir*1.3846153846).rgb * 0.3162162162;\n" +
        " c += texture2D(tS, vUv - uDir*1.3846153846).rgb * 0.3162162162;\n" +
        " c += texture2D(tS, vUv + uDir*3.2307692308).rgb * 0.0702702703;\n" +
        " c += texture2D(tS, vUv - uDir*3.2307692308).rgb * 0.0702702703;\n" +
        " gl_FragColor = vec4(c, 1.0); }",
    }),
  );
  const comp = track(
    new THREE.ShaderMaterial({
      uniforms: {
        tS: { value: null },
        tB: { value: null },
        uBloom: { value: 0.34 },
        uCA: { value: 1 },
        uVig: { value: 1 },
        uExp: { value: 0.62 },
        uFade: { value: 0 },
        uSat: { value: 1.0 },
        uCap: { value: 0.11 },
      },
      vertexShader: QUAD_VS,
      fragmentShader: /* glsl */ `
        uniform sampler2D tS; uniform sampler2D tB;
        uniform float uBloom, uCA, uVig, uExp, uFade, uSat, uCap;
        varying vec2 vUv;
        vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
        void main(){
          vec2 d = vUv - 0.5; float r2 = dot(d,d);
          float ca = uCA * (0.30 + r2*2.6) * 0.0013;
          vec3 c;
          c.r = texture2D(tS, vUv + d*ca).r;
          c.g = texture2D(tS, vUv).g;
          c.b = texture2D(tS, vUv - d*ca).b;
          c += texture2D(tB, vUv).rgb * uBloom;
          c *= uExp;
          c = aces(c);
          float l = dot(c, vec3(0.2126,0.7152,0.0722));
          c = mix(vec3(l), c, uSat);
          c = mix(c, c*vec3(0.74,1.03,1.11), smoothstep(0.55,0.0,l)*0.80);
          float v = smoothstep(1.22, 0.26, length(d*vec2(1.0,0.94))*1.42);
          c *= mix(1.0, v, uVig);
          c *= uFade;
          vec3 e = pow(max(c,0.0), vec3(1.0/2.2));
          /* Readability ceiling: the page text sits on top of this frame, so
             highlights are compressed above uCap instead of blowing out. */
          float m = max(max(e.r,e.g),e.b);
          if (m > uCap) e *= (uCap + (m - uCap)*0.25) / m;
          gl_FragColor = vec4(e, 1.0);
        }`,
    }),
  );
  {
    const w = renderer.domElement.width;
    const h = renderer.domElement.height;
    const O = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    } as const;
    POST.scene = track(new THREE.WebGLRenderTarget(w, h, { ...O, depthBuffer: true, samples: LOW ? 0 : 2 }));
    let lw = Math.max(2, w >> 1);
    let lh = Math.max(2, h >> 1);
    for (let i = 0; i < (LOW ? 3 : 4); i++) {
      POST.levels.push({
        a: track(new THREE.WebGLRenderTarget(lw, lh, O)),
        b: track(new THREE.WebGLRenderTarget(lw, lh, O)),
        w: lw,
        h: lh,
      });
      lw = Math.max(2, lw >> 1);
      lh = Math.max(2, lh >> 1);
    }
  }
  function pass(mat: THREE.Material, target: THREE.WebGLRenderTarget | null, additive = false) {
    POST.quad.material = mat;
    renderer.setRenderTarget(target);
    if (!additive) renderer.clear(true, false, false);
    renderer.render(POST.qScene, POST.cam);
  }
  function renderPost() {
    const L = POST.levels;
    bright.uniforms.tS.value = POST.scene.texture;
    pass(bright, L[0].a);
    for (let i = 0; i < L.length; i++) {
      if (i > 0) {
        up.blending = THREE.NoBlending;
        up.uniforms.uAmt.value = 1;
        up.uniforms.tS.value = L[i - 1].a.texture;
        pass(up, L[i].a);
      }
      blur.uniforms.tS.value = L[i].a.texture;
      blur.uniforms.uDir.value.set(1 / L[i].w, 0);
      pass(blur, L[i].b);
      blur.uniforms.tS.value = L[i].b.texture;
      blur.uniforms.uDir.value.set(0, 1 / L[i].h);
      pass(blur, L[i].a);
    }
    up.blending = THREE.AdditiveBlending;
    up.uniforms.uAmt.value = 0.52;
    for (let i = L.length - 1; i > 0; i--) {
      up.uniforms.tS.value = L[i].a.texture;
      pass(up, L[i - 1].a, true);
    }
    comp.uniforms.tS.value = POST.scene.texture;
    comp.uniforms.tB.value = L[0].a.texture;
    pass(comp, null);
  }

  await job();

  /* ── camera rig (Kage) ── */
  type Track = { el: Element; keys: Keyframe[] };
  const tracks: Track[] = SCENES.flatMap((s) => {
    const el = document.querySelector(s.selector);
    return el ? [{ el, keys: s.keys }] : [];
  });
  const KEYS: Keyframe[] = tracks.flatMap((t) => t.keys);
  const N = KEYS.length - 1;
  const v3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
  const curveP = new THREE.CatmullRomCurve3(KEYS.map((k) => v3(k.p)), false, "catmullrom", 0.42);
  const curveT = new THREE.CatmullRomCurve3(KEYS.map((k) => v3(k.t)), false, "catmullrom", 0.42);
  const RIG = { prog: 0, smooth: 0, mx: 0, my: 0, tmx: 0, tmy: 0, intro: 0 };
  const _p = new THREE.Vector3();
  const _t = new THREE.Vector3();
  const _d = new THREE.Vector3();

  /* Waypoints are composed for a wide frame; on a tall one the rig steps back and opens up. */
  const aspectFix = () => clamp((1.62 - vpW() / vpH()) / 1.05, 0, 1);
  function fitAspect(p: THREE.Vector3, t: THREE.Vector3, fov: number) {
    const nf = aspectFix();
    if (nf <= 0) return fov;
    _d.subVectors(p, t).normalize();
    p.addScaledVector(_d, nf * 8.2);
    p.y += nf * 1.1;
    return fov * (1 + nf * 0.4);
  }
  function applyCamera() {
    const u = N > 0 ? clamp(RIG.smooth / N, 0, 1) : 0;
    curveP.getPoint(u, _p);
    curveT.getPoint(u, _t);
    const i = clamp(Math.floor(RIG.smooth), 0, Math.max(0, N - 1));
    const f = clamp(RIG.smooth - i, 0, 1);
    let fov = N > 0 ? lerp(KEYS[i].fov, KEYS[i + 1].fov, f) : KEYS[0].fov;
    fov = fitAspect(_p, _t, fov);
    // the opening dolly: a long lens easing in from further back
    const io = 1 - RIG.intro;
    _p.z += io * 5.6;
    _p.y += io * 0.65;
    fov += io * 8;
    // hand-held parallax, strongest at the opening
    const par = 1 - smooth(0, 1.6, RIG.smooth) * 0.55;
    _p.x += RIG.mx * 0.62 * par;
    _p.y += RIG.my * 0.34 * par;
    _t.x -= RIG.mx * 0.2 * par;
    _t.y -= RIG.my * 0.12 * par;
    camera.position.copy(_p);
    camera.lookAt(_t);
    if (Math.abs(camera.fov - fov) > 1e-4) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }

  /* ── scroll ↔ keyframes (Kage's measure / progressFor, extended for two-key sections) ── */
  let anchors: number[] = [];
  function measure() {
    const vh = vpH();
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    const out: number[] = [];
    tracks.forEach((tr, ti) => {
      const r = tr.el.getBoundingClientRect();
      const top = r.top + scrollY;
      const h = r.height;
      if (ti === 0) out.push(0);
      else if (ti === tracks.length - 1) out.push(maxScroll);
      else if (tr.keys.length === 1) out.push(clamp(top + h * 0.5 - vh * 0.5, 0, maxScroll));
      else {
        out.push(clamp(top - vh * 0.25, 0, maxScroll));
        out.push(clamp(top + h - vh * 0.75, 0, maxScroll));
      }
      // a first or last section that carries two keys still needs both slots
      if ((ti === 0 || ti === tracks.length - 1) && tr.keys.length === 2) out.push(out[out.length - 1]);
    });
    for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + 1);
    anchors = out;
  }
  function progressFor(y: number) {
    if (y <= anchors[0]) return 0;
    for (let i = 0; i < anchors.length - 1; i++)
      if (y <= anchors[i + 1]) return i + (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
    return anchors.length - 1;
  }

  /* ── environment, blended from the same progress ── */
  const ENV_KEYS = Object.keys(KEYS[0].env) as (keyof Env)[];
  const E = { ...KEYS[0].env };
  function envAt(x: number) {
    const i = clamp(Math.floor(x), 0, Math.max(0, N - 1));
    const f = N > 0 ? smooth(0, 1, x - i) : 0;
    const a = KEYS[i].env;
    const b = KEYS[Math.min(i + 1, N)].env;
    for (const k of ENV_KEYS) E[k] = lerp(a[k], b[k], f);
  }
  const _glowCol = new THREE.Color();
  function updateWorld() {
    U.uFogD.value = E.fog;
    U.uGrid.value = E.grid;
    U.uNet.value = E.net;
    U.uPulse.value = E.pulse;
    comp.uniforms.uBloom.value = E.bloom;
    comp.uniforms.uExp.value = E.exposure;

    _glowCol.copy(SIGNAL).lerp(WARM, E.warm);
    const breathe = 1 + Math.sin(clock * 0.34) * 0.05;
    (halo.material as THREE.MeshBasicMaterial).color.copy(_glowCol);
    (core.material as THREE.MeshBasicMaterial).color.copy(_glowCol);
    (band.material as THREE.MeshBasicMaterial).color.copy(_glowCol);
    (halo.material as THREE.MeshBasicMaterial).opacity = 0.3 * E.glow * breathe;
    (core.material as THREE.MeshBasicMaterial).opacity = 0.7 * E.glow;
    (band.material as THREE.MeshBasicMaterial).opacity = 0.22 * E.glow;
    halo.quaternion.copy(camera.quaternion);
    core.quaternion.copy(camera.quaternion);

    for (const h of haze) {
      const d = h.userData;
      h.position.x = d.x0 + Math.sin(clock * d.sp + d.ph) * 5.5;
      h.quaternion.copy(camera.quaternion);
    }
  }

  /* ── the machine ── */
  let clock = 0;
  let tPrev = 0;
  let raf = 0;
  let running = false;
  let fadeIn = 0;
  const t0 = performance.now();

  function resize() {
    const w = vpW();
    const h = vpH();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP) * PERF.scale);
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const pw = renderer.domElement.width;
    const ph = renderer.domElement.height;
    POST.scene.setSize(pw, ph);
    let lw = Math.max(2, pw >> 1);
    let lh = Math.max(2, ph >> 1);
    POST.levels.forEach((L) => {
      L.a.setSize(lw, lh);
      L.b.setSize(lw, lh);
      L.w = lw;
      L.h = lh;
      lw = Math.max(2, lw >> 1);
      lh = Math.max(2, lh >> 1);
    });
    U.uSize.value = h * renderer.getPixelRatio() * 0.5;
    measure();
  }

  function render() {
    renderer.setRenderTarget(POST.scene);
    renderer.clear(true, true, false);
    renderer.render(scene, camera);
    comp.uniforms.uFade.value = fadeIn;
    renderPost();
  }

  function frame(now: number) {
    if (!running) return;
    // Phones and low-core machines draw at 30 fps: the motion is slow and damped, so the
    // difference is invisible, and it halves the main-thread cost of the loop.
    if (LOW && now - tPrev < FRAME_MIN_MS) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const raw = (now - tPrev) / 1000 || 0;
    const dt = Math.min(raw, 0.05); // animation never jumps…
    tPrev = now;
    fadeIn = sat((now - t0) / 900);

    // …but the governor reads the truth: trade resolution for frame rate
    if (now - t0 > 2200) {
      PERF.acc += raw;
      PERF.n++;
      if (PERF.n >= 40 || PERF.acc > 0.9) {
        const avg = PERF.acc / PERF.n;
        PERF.acc = 0;
        PERF.n = 0;
        if (avg > SLOW && PERF.scale > 0.55) {
          PERF.scale = Math.max(0.55, PERF.scale * (avg > 0.05 ? 0.64 : 0.85));
          resize();
        } else if (avg < FAST && PERF.scale < 1) {
          PERF.scale = Math.min(1, PERF.scale + 0.08);
          resize();
        }
      }
    }

    RIG.prog = progressFor(scrollY);
    RIG.smooth = damp(RIG.smooth, RIG.prog, 5.2, dt);
    RIG.mx = damp(RIG.mx, RIG.tmx, 2.6, dt);
    RIG.my = damp(RIG.my, RIG.tmy, 2.6, dt);
    RIG.intro = sat((now - t0) / 2400);

    envAt(RIG.smooth);
    clock += dt * E.time; // ambient motion settles toward the end of the story
    U.uT.value = clock;

    applyCamera();
    updateWorld();
    render();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    tPrev = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onPointer = (e: PointerEvent) => {
    RIG.tmx = (e.clientX / vpW()) * 2 - 1;
    RIG.tmy = -((e.clientY / vpH()) * 2 - 1);
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onResize = () => resize();
  const ro = new ResizeObserver(() => measure());

  if (!COARSE) addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  ro.observe(document.body);

  resize();
  RIG.prog = RIG.smooth = progressFor(scrollY); // land on the right scene after a reload mid-page

  // Compile every program off the main thread (KHR_parallel_shader_compile) before the first
  // frame, so the scene never arrives as one long blocking task.
  await job();
  await renderer.compileAsync(scene, camera);
  const postCompile = new THREE.Scene();
  for (const m of [up, bright, blur, comp]) postCompile.add(new THREE.Mesh(POST.quad.geometry, m));
  await renderer.compileAsync(postCompile, POST.cam);
  applyCamera();
  start();

  (window as unknown as { __signalScene?: unknown }).__signalScene = {
    get progress() {
      return { prog: RIG.prog, smooth: RIG.smooth, anchors: [...anchors], keyframes: KEYS.length, scale: PERF.scale };
    },
  };

  return {
    dispose() {
      stop();
      removeEventListener("pointermove", onPointer);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      delete (window as unknown as { __signalScene?: unknown }).__signalScene;
    },
  };
}
