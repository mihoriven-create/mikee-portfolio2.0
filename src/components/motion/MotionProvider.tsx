"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const REVEAL_SELECTOR = "[data-reveal], [data-mask], [data-draw]";

/**
 * Site-wide motion setup:
 * - Lenis smooth scrolling (desktop pointer only, off for reduced motion), driven by GSAP's ticker
 *   so ScrollTrigger stays in sync.
 * - One IntersectionObserver that adds `.is-in` to reveal targets.
 */
export function MotionProvider() {
  useEffect(() => {
    const reduced = prefersReducedMotion();

    // Reveals
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el));

    // Smooth scroll
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!reduced && finePointer) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        anchors: { offset: 0 },
        // Let dialogs (menu, lightbox, contact form) scroll natively.
        prevent: (node) => !!node.closest?.("dialog"),
      });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Fonts can shift layout after first measure.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      io.disconnect();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
