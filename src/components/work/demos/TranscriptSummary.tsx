// Illustrative schematic: a long call transcript condensed into a short structured summary
// on the CRM record. Abstract bars only — no invented call content.

const transcript = [92, 78, 85, 64, 88, 71, 95, 58, 82, 76, 90, 67, 84, 73];
const summary = [70, 54, 62];

export function TranscriptSummary() {
  return (
    <figure className="frame p-5 md:p-6">
      <div className="grid grid-cols-[1fr_auto_0.8fr] items-center gap-3 md:gap-6">
        <div>
          <p className="label mb-3 !text-[10px]">Call transcript</p>
          <div className="space-y-[7px]" aria-hidden>
            {transcript.map((w, i) => (
              <div
                key={i}
                data-draw
                className="h-[3px] rounded-full bg-ink-3"
                style={{ width: `${w}%`, "--d": `${i * 0.03}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center" aria-hidden>
          <span className="h-px w-8 bg-line-2 md:w-14" />
          <span className="rounded border border-signal/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
            AI
          </span>
          <span className="h-px w-8 bg-line-2 md:w-14" />
        </div>

        <div className="rounded-md border border-line-2 bg-ink-1 p-3 md:p-4">
          <p className="label mb-3 !text-[10px]">CRM record</p>
          <div className="space-y-3" aria-hidden>
            {summary.map((w, i) => (
              <div key={i}>
                <div className="mb-1.5 h-[3px] w-8 rounded-full bg-signal/60" />
                <div
                  data-draw
                  className="h-[3px] rounded-full bg-fg-3"
                  style={{ width: `${w}%`, "--d": `${0.5 + i * 0.12}s` } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-5 border-t border-line pt-3 font-mono text-[11px] text-fg-3">
        Illustrative — long call transcripts in, a structured summary on the CRM record out.
      </figcaption>
    </figure>
  );
}
