"use client";

import { useEffect, useRef } from "react";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Fixed full-viewport canvas behind the page. three.js and the scene are loaded only
 * after the page is idle, so they never compete with the first paint. Without WebGL2,
 * or with reduced motion requested, nothing starts and the static backgrounds remain.
 */
export function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !webglAvailable()) return;

    let handle: { dispose: () => void } | null = null;
    let cancelled = false;
    const root = document.documentElement;

    const boot = async () => {
      try {
        const { startScene } = await import("./engine");
        if (cancelled) return;
        const h = await startScene(canvas);
        if (cancelled) return h.dispose();
        handle = h;
        root.classList.add("has-scene");
      } catch (err) {
        console.warn("[scene] background disabled:", err);
      }
    };

    const idle = (cb: () => void) =>
      "requestIdleCallback" in window ? requestIdleCallback(cb) : setTimeout(cb, 1200);
    const kick = () => idle(boot);
    if (document.readyState === "complete") kick();
    else addEventListener("load", kick, { once: true });

    return () => {
      cancelled = true;
      removeEventListener("load", kick);
      handle?.dispose();
      root.classList.remove("has-scene");
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="scene-canvas" />;
}
