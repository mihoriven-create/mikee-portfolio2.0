"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const text =
  "Leads arrive from forms, calls and campaigns. Teams work across CRMs, inboxes and spreadsheets. My job is making sure nothing falls between them.";

/** A single sentence that brightens word by word as it scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-word]",
        // 0.4 keeps unlit words above 3:1 contrast for this (large) text size.
        { opacity: 0.4 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section aria-label="Approach" data-scene="approach" className="shell py-28 md:py-44">
      <div className="grid gap-8 md:grid-cols-12">
        <p className="label md:col-span-2 md:pt-4">(Approach)</p>
        <p
          ref={ref}
          className="font-display text-[clamp(1.85rem,4.4vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.025em] md:col-span-10"
        >
          {text.split(" ").map((w, i) => (
            <span key={i}>
              <span data-word>{w}</span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
