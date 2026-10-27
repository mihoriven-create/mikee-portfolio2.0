"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// The three intake stages and where each one's data goes, as described in the case study:
// submission data → GoHighLevel, uploaded documents → private storage.
const stages = [
  { id: "business", label: "Business", fields: 3, to: "crm" },
  { id: "deal", label: "Deal details", fields: 4, to: "crm" },
  { id: "documents", label: "Documents", fields: 0, to: "storage" },
] as const;

export function IntakeFlow() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto || prefersReducedMotion()) return;
    const el = ref.current;
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) timer = setInterval(() => setActive((a) => (a + 1) % stages.length), 2600);
      if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [auto]);

  const stage = stages[active];
  const choose = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div ref={ref} className="frame">
      <div className="frame__bar">
        <span className="frame__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="font-mono text-[11px] text-fg-3">Deal intake — illustrative interface</span>
      </div>

      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* Form shell */}
        <div className="border-line p-5 md:border-r md:p-7">
          <div className="flex gap-1" role="group" aria-label="Intake steps">
            {stages.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={i === active}
                className={`flex-1 border-t-2 pt-3 text-left text-xs transition-colors duration-500 sm:text-[13px] ${
                  i === active ? "border-signal text-fg" : i < active ? "border-fg-3 text-fg-2" : "border-line-2 text-fg-3"
                }`}
              >
                <span className="font-mono text-[10px]">0{i + 1}</span>
                <span className="mt-1 block">{s.label}</span>
              </button>
            ))}
          </div>

          <div key={stage.id} className="mt-7 min-h-[188px] animate-[fade-up_.6s_var(--ease-out)]">
            {stage.fields > 0 ? (
              <div className="grid grid-cols-2 gap-3" aria-hidden>
                {Array.from({ length: stage.fields }).map((_, k) => (
                  <div key={k} className={stage.fields === 3 || k === 0 || k === 3 ? "col-span-2" : ""}>
                    <div className="mb-2 h-1.5 w-16 rounded-full bg-ink-3" />
                    <div className="h-10 rounded-md border border-line-2 bg-ink-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid h-[188px] place-items-center rounded-md border border-dashed border-line-2 bg-ink-1 text-center">
                <div>
                  <p className="text-sm text-fg-2">Upload supporting documents</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">Stored privately · no public URLs</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data path */}
        <div className="flex flex-col justify-between gap-6 border-t border-line p-5 md:border-t-0 md:p-7">
          <p className="label">Where it goes</p>
          <ol className="relative flex flex-col gap-4" aria-label="Data destinations">
            <Dest label="GoHighLevel" note="Submission data via API" on={stage.to === "crm"} />
            <Dest label="Private file storage" note="Uploaded documents" on={stage.to === "storage"} />
          </ol>
          <div>
            <p className="label mb-3">Built &amp; shipped with</p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-fg-2">
              <span className="rounded border border-line-2 px-2 py-1">Next.js</span>
              <span aria-hidden className="h-px flex-1 bg-line-2" />
              <span className="rounded border border-line-2 px-2 py-1">GitHub</span>
              <span aria-hidden className="h-px flex-1 bg-line-2" />
              <span className="rounded border border-line-2 px-2 py-1">Vercel</span>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {active + 1}, {stage.label}: sent to {stage.to === "crm" ? "GoHighLevel" : "private file storage"}.
      </p>
    </div>
  );
}

function Dest({ label, note, on }: { label: string; note: string; on: boolean }) {
  return (
    <li
      className={`flex items-center gap-4 rounded-md border px-4 py-3 transition-[border-color,background-color] duration-500 ${
        on ? "border-signal/70 bg-signal/[0.06]" : "border-line-2"
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-500 ${on ? "bg-signal shadow-[0_0_12px_var(--signal)]" : "bg-ink-3"}`}
      />
      <span>
        <span className={`block text-sm transition-colors duration-500 ${on ? "text-fg" : "text-fg-2"}`}>{label}</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-fg-3">{note}</span>
      </span>
    </li>
  );
}
