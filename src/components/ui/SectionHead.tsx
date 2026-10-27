type Props = {
  id: string;
  index: string;
  kicker: string;
  /** Title lines; each one rises through its own mask. */
  lines: string[];
  aside?: React.ReactNode;
};

/** Editorial section opener: numbered kicker, hairline, oversized title. */
export function SectionHead({ id, index, kicker, lines, aside }: Props) {
  return (
    <header className="mb-14 md:mb-24">
      <div className="flex items-center gap-4">
        <span className="label text-fg-2">({index})</span>
        <span className="label">{kicker}</span>
        <span className="rule flex-1" data-draw aria-hidden />
      </div>
      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
        <h2 id={id} className="display text-[clamp(2.75rem,8.4vw,9rem)] md:col-span-8">
          {lines.map((line, i) => (
            <span key={line} data-mask style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}>
              <span>{line}</span>
            </span>
          ))}
        </h2>
        {aside ? (
          <div className="max-w-md text-fg-2 md:col-span-4 md:justify-self-end" data-reveal>
            {aside}
          </div>
        ) : null}
      </div>
    </header>
  );
}
