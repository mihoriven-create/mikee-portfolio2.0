"use client";

import { useState } from "react";
import { capabilities, projects, toolkit, type Capability } from "@/content/site";
import { SectionHead } from "./ui/SectionHead";
import { ArrowRight } from "./ui/Icons";

const seenIn = (id: string) => projects.filter((p) => p.capabilityIds.includes(id));

function Detail({ c }: { c: Capability }) {
  const cases = seenIn(c.id);
  return (
    <div key={c.id} className="animate-[fade-up_.5s_var(--ease-out)]">
      <p className="text-lg leading-relaxed text-fg md:text-xl">{c.description}</p>
      <p className="label mt-8">Tools</p>
      <p className="mt-2 text-fg-2">{c.tools.join(" · ")}</p>
      {cases.length ? (
        <>
          <p className="label mt-8">Seen in</p>
          <ul className="mt-2 space-y-1">
            {cases.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="group inline-flex items-baseline gap-3 py-1 text-fg-2 hover:text-fg">
                  <span className="font-mono text-[11px] text-signal">{p.index}</span>
                  <span className="link-u">{p.title}</span>
                  <ArrowRight className="translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export function Capabilities() {
  const [active, setActive] = useState(0);
  const current = capabilities[active];

  return (
    <section id="capabilities" aria-labelledby="cap-title" className="shell scroll-mt-[var(--nav-h)] py-28 md:py-40">
      <SectionHead
        id="cap-title"
        index="02"
        kicker="Technical capabilities"
        lines={["What I", "work on"]}
        aside={<p>Eight areas of day-to-day work, each tied back to the case studies where you can see it in practice.</p>}
      />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <ul className="border-b border-line lg:col-span-7">
          {capabilities.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.id} className="border-t border-line">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`cap-${c.id}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                >
                  <span className={`font-mono text-xs transition-colors duration-300 ${on ? "text-signal" : "text-fg-3"}`}>
                    0{i + 1}
                  </span>
                  <span
                    className={`font-display text-[clamp(1.35rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.02em] transition-[color,transform] duration-500 ease-[var(--ease-out)] ${
                      on ? "translate-x-2 text-fg" : "text-fg-3 group-hover:text-fg-2"
                    }`}
                  >
                    {c.title}
                  </span>
                </button>
                {/* Inline detail on small screens */}
                <div id={`cap-${c.id}`} className={`pb-8 pl-9 lg:hidden ${on ? "" : "hidden"}`}>
                  {on ? <Detail c={c} /> : null}
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-live="polite">
          <div className="sticky top-[calc(var(--nav-h)+2rem)] border-t border-signal/60 pt-6">
            <p className="label mb-6 text-fg-2">
              0{active + 1} — {current.title}
            </p>
            <Detail c={current} />
          </div>
        </aside>
      </div>

      <div className="mt-28 md:mt-36">
        <div className="mb-10 flex items-center gap-4">
          <h3 className="label text-fg-2">Toolkit</h3>
          <span className="rule flex-1" data-draw aria-hidden />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
          {toolkit.map((g, i) => (
            <div key={g.group} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
              <h4 className="label">{g.group}</h4>
              <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-fg-2">
                {g.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
