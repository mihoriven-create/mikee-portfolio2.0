import type { Project } from "@/content/site";

type Props = {
  project: Project;
  total: number;
  layout: "split" | "split-reverse" | "wide";
  visual: React.ReactNode;
};

const story = [
  { key: "challenge", label: "Challenge" },
  { key: "solution", label: "Solution" },
  { key: "implementation", label: "Implementation" },
  { key: "outcome", label: "Outcome" },
] as const;

export function ProjectChapter({ project: p, total, layout, visual }: Props) {
  const titleId = `${p.id}-title`;

  const head = (
    <div className="flex flex-col">
      <span aria-hidden className="outline-num text-[clamp(5.5rem,13vw,12rem)]" data-reveal="fade">
        {p.index}
      </span>
      <p className="label mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-fg-2">{p.category}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className={
              p.status === "Implemented"
                ? "signal-dot"
                : "inline-block h-[6px] w-[6px] rounded-full border border-fg-2"
            }
          />
          {p.status}
        </span>
      </p>
      <h3
        id={titleId}
        className="mt-4 font-display text-[clamp(1.9rem,3.3vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.025em]"
        data-reveal
      >
        {p.title}
      </h3>
    </div>
  );

  const body = (
    <div>
      <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-fg-2" data-reveal style={{ "--d": "0.08s" } as React.CSSProperties}>
        {p.summary}
      </p>
      <dl className="mt-8 max-w-xl text-sm" data-reveal style={{ "--d": "0.14s" } as React.CSSProperties}>
        {[
          ["Role", p.role],
          ["Context", p.context],
          ["Built with", p.stack.join(" / ")],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-3">
            <dt className="label pt-0.5">{k}</dt>
            <dd className="text-fg-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  const visualBlock = (
    <div data-parallax className="will-change-transform">
      <div data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
        {visual}
      </div>
    </div>
  );

  return (
    <article id={p.id} aria-labelledby={titleId} className="relative scroll-mt-[var(--nav-h)] py-20 md:py-32">
      <div className="mb-10 flex items-center gap-4 md:mb-14">
        <span className="label tabular-nums text-fg-2">
          Case {p.index} / {String(total).padStart(2, "0")}
        </span>
        <span className="rule flex-1" data-draw aria-hidden />
      </div>

      {layout === "wide" ? (
        <>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 lg:col-span-7">{head}</div>
            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">{body}</div>
          </div>
          <div className="mt-14 md:mt-20">{visualBlock}</div>
        </>
      ) : (
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className={`min-w-0 lg:col-span-5 ${layout === "split-reverse" ? "lg:order-2 lg:col-start-8" : ""}`}>
            {head}
            {body}
          </div>
          <div
            className={`min-w-0 lg:col-span-7 lg:self-end ${
              layout === "split-reverse" ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"
            }`}
          >
            {visualBlock}
          </div>
        </div>
      )}

      <ol className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 md:mt-20 xl:grid-cols-4">
        {story.map((s, i) => (
          <li
            key={s.key}
            className="bg-ink p-6 md:p-7"
            data-reveal
            style={{ "--d": `${i * 0.07}s` } as React.CSSProperties}
          >
            <p className="label flex items-center gap-2">
              {s.key === "outcome" ? <span aria-hidden className="signal-dot" /> : <span className="font-mono">{String.fromCharCode(65 + i)}</span>}
              {s.label}
            </p>
            <p className={`mt-4 text-[0.9375rem] leading-relaxed ${s.key === "outcome" ? "text-fg" : "text-fg-2"}`}>
              {p[s.key]}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
