"use client";

import { useEffect, useRef } from "react";

// The steps of the real "BL-Appointment Booked Notification" workflow,
// shown in the GoHighLevel screenshot in case study 02.
const steps = [
  { kind: "Trigger", label: "Customer booked appointment" },
  { kind: "Action", label: "Create or update opportunity" },
  { kind: "Action", label: "Add tag" },
  { kind: "Action", label: "Send Slack notification" },
  { kind: "Action", label: "Internal notification" },
  { kind: "Action", label: "Remove from workflow" },
];

// Seconds the pulse takes to cross the track (the 80% mark of the 6s pulse-travel cycle).
// Each node lights as the pulse reaches its column.
const TRAVEL = 4.8;

export function SignalPath() {
  const ref = useRef<HTMLElement>(null);

  // Pause the loop when the figure is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="hero-fade" style={{ "--d": "0.9s" } as React.CSSProperties}>
      <div className="signal-track">
        <span aria-hidden className="absolute inset-x-0 top-[13px] h-px bg-line-2 max-md:hidden" />
        <div aria-hidden className="absolute inset-x-0 top-[13px] max-md:hidden">
          <span className="signal-pulse" />
        </div>
        <ol className="relative grid grid-cols-3 gap-y-6 md:grid-cols-6">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className="flex flex-col gap-3 pr-3"
            >
              <span
                className="signal-node grid h-[27px] w-[27px] place-items-center rounded-full border border-line-2 bg-ink font-mono text-[10px] text-fg-2"
                style={{ "--t": `${(i / steps.length) * 0.95 * TRAVEL}s` } as React.CSSProperties}
              >
                {i + 1}
              </span>
              <span className="label !text-[10px]">{s.kind}</span>
              <span className="text-[13px] leading-snug text-fg-2">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2">Fig. 01</span>
        <span>
          An appointment-booked workflow I built in GoHighLevel — trigger to team alert.{" "}
          <a href="#ghl-workflows" className="link-u text-fg-2 hover:text-fg">
            See it in case study 02
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
