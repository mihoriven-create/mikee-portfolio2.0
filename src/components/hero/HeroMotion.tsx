"use client";

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Scroll-linked exit: the name drifts up and dims as the hero leaves. */
export function HeroMotion() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const name = document.querySelector("[data-hero-name]");
    if (!name) return;
    gsap.to(name, {
      yPercent: -18,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
    });
  });
  return null;
}
