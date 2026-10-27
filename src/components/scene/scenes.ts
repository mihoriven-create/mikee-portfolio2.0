// The background story, one entry per existing page section, in page order.
// Each keyframe is a camera waypoint plus the environment state at that point;
// the engine blends between neighbouring keyframes from one scroll-progress value.
//
// Sections with two keyframes are long (Work, About) — the camera keeps drifting
// from the first to the second while you read, instead of parking.

export type Env = {
  fog: number; // exponential fog density
  glow: number; // horizon light intensity
  warm: number; // 0 = signal cyan, 1 = warm white (closing scene)
  grid: number; // blueprint floor visibility
  net: number; // network line visibility
  pulse: number; // signal pulse rate along grid + network
  time: number; // ambient motion speed (motes, haze); settles toward the end
  bloom: number;
  exposure: number;
};

export type Keyframe = { p: [number, number, number]; t: [number, number, number]; fov: number; env: Env };

export type Scene = {
  /** CSS selector of an existing element on the page. */
  selector: string;
  name: string;
  keys: Keyframe[];
};

const env = (e: Partial<Env>): Env => ({
  fog: 0.02,
  glow: 0.5,
  warm: 0,
  grid: 0.5,
  net: 0.5,
  pulse: 0.6,
  time: 1,
  bloom: 0.34,
  exposure: 0.62,
  ...e,
});

export const SCENES: Scene[] = [
  {
    selector: "#top",
    name: "Opening — over the field, facing the light",
    keys: [{ p: [0, 6.2, 18], t: [0, 5.2, -60], fov: 40, env: env({ fog: 0.017, glow: 0.55, grid: 0.6, net: 0.22, pulse: 0.45 }) }],
  },
  {
    selector: "[data-scene='approach']",
    name: "Transition — descending into depth",
    keys: [{ p: [-6.5, 3.1, 1], t: [4, 4.2, -60], fov: 46, env: env({ fog: 0.022, glow: 0.42, grid: 0.62, net: 0.5, pulse: 0.75 }) }],
  },
  {
    selector: "#work",
    name: "Projects — inside the network",
    keys: [
      { p: [4.5, 2.4, -24], t: [-2, 3.6, -82], fov: 44, env: env({ fog: 0.027, glow: 0.34, grid: 0.42, net: 0.95, pulse: 1 }) },
      { p: [-3.5, 2.9, -56], t: [2.5, 4.2, -118], fov: 42, env: env({ fog: 0.026, glow: 0.38, grid: 0.45, net: 1, pulse: 1 }) },
    ],
  },
  {
    selector: "#capabilities",
    name: "Capabilities — rising above the structure",
    keys: [{ p: [0.5, 15, -66], t: [0, 0, -102], fov: 50, env: env({ fog: 0.016, glow: 0.4, grid: 0.72, net: 1, pulse: 0.8 }) }],
  },
  {
    selector: "#about",
    name: "Experience — a long path along the grid",
    keys: [
      { p: [-8, 3, -86], t: [6, 3, -142], fov: 40, env: env({ fog: 0.02, glow: 0.5, grid: 0.6, net: 0.6, pulse: 0.55 }) },
      { p: [6, 3.4, -110], t: [-4, 4, -172], fov: 40, env: env({ fog: 0.02, glow: 0.55, grid: 0.56, net: 0.55, pulse: 0.5 }) },
    ],
  },
  {
    selector: "#feedback",
    name: "Feedback — the haze thickens",
    keys: [{ p: [0, 4.6, -124], t: [0, 6, -200], fov: 44, env: env({ fog: 0.025, glow: 0.62, grid: 0.4, net: 0.38, pulse: 0.35, time: 0.7 }) }],
  },
  {
    selector: "#contact",
    name: "Closing — rising toward the light",
    keys: [
      {
        p: [0, 7.2, -138],
        t: [0, 12, -222],
        fov: 38,
        env: env({ fog: 0.014, glow: 0.52, warm: 0.55, grid: 0.34, net: 0.22, pulse: 0.2, time: 0.35, bloom: 0.38 }),
      },
    ],
  },
  {
    selector: "footer",
    name: "End — settled",
    keys: [
      {
        p: [0, 9, -142],
        t: [0, 14, -222],
        fov: 36,
        env: env({ fog: 0.014, glow: 0.45, warm: 0.7, grid: 0.28, net: 0.16, pulse: 0.15, time: 0.25, bloom: 0.34, exposure: 0.56 }),
      },
    ],
  },
];
