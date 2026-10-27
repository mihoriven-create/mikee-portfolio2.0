"use client";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Gentle depth: case-study visuals drift against the scroll on large screens only. */
export function WorkMotion() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.utils.toArray<HTMLElement>("#work [data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48 },
          {
            y: -48,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  });
  return null;
}
