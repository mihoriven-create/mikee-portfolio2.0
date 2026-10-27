import Image from "next/image";
import { education, experience, profile } from "@/content/site";
import { SectionHead } from "./ui/SectionHead";
import { Plus } from "./ui/Icons";

const principles = [
  { title: "Connect what's disconnected", body: "CRMs, forms, phones, spreadsheets and inboxes, working from the same data." },
  { title: "Remove the repetitive work", body: "If a person is copying, tagging or chasing by hand, it is a candidate for a workflow." },
  { title: "Fix the cause, not the symptom", body: "Root-cause analysis across CRMs, APIs, webhooks and document workflows." },
  { title: "Write it down", body: "Documentation and SOPs so systems stay reliable after the build." },
];

const facts = [
  ["Current role", "CRM & Technical Operations Specialist, American Financial Services, LLC"],
  ["Core platforms", "GoHighLevel, Zoho CRM, ClickUp, Monday.com, Notion"],
  ["Technical roots", "Field service IT technician since 2018"],
  ["Education", `${education.field}, ${education.school}`],
  ["Based in", profile.location],
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="shell scroll-mt-[var(--nav-h)] py-28 md:py-40">
      <SectionHead id="about-title" index="03" kicker="About" lines={["Systems", "people rely on"]} />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <figure className="relative w-44 md:w-52" data-reveal>
            <div className="frame !rounded-md">
              <Image
                src={profile.portrait.src}
                alt="Portrait of Michael John Buencamino"
                width={profile.portrait.width}
                height={profile.portrait.height}
                sizes="208px"
                className="h-auto w-full grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
              />
            </div>
            <figcaption className="label mt-3">Michael John “Mikee” Buencamino</figcaption>
          </figure>
          <dl className="mt-10 text-sm" data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-line py-3">
                <dt className="label pt-0.5">{k}</dt>
                <dd className="text-fg-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="space-y-6 text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.5] text-fg-2" data-reveal>
            <p className="text-fg">
              I support US-based businesses by managing the systems their sales and operations run on — CRMs, workflow
              automations and the backend processes in between.
            </p>
            <p>
              Most of my work sits between tools a team already pays for: the CRM, the phone system, the forms, the
              spreadsheets, the inbox. I build and maintain the workflows that connect them — lead routing, follow-up
              sequences, AI call summaries, integrations — and when something breaks, I trace it to the root cause.
            </p>
            <p>
              My background is hands-on IT. I&apos;ve worked as a field service technician since 2018, installing and
              maintaining hardware, software and networks — which is where the habit comes from: find the actual cause,
              fix it properly, and document it so it stays fixed.
            </p>
          </div>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {principles.map((pr, i) => (
              <li key={pr.title} className="bg-ink p-6" data-reveal style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
                <span className="font-mono text-[11px] text-signal">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-[-0.01em]">{pr.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{pr.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Experience */}
      <div id="experience" className="mt-28 scroll-mt-[var(--nav-h)] md:mt-40">
        <div className="mb-10 flex items-center gap-4">
          <h3 className="label text-fg-2">Experience</h3>
          <span className="rule flex-1" data-draw aria-hidden />
        </div>
        <ol className="border-b border-line">
          {experience.map((r) => (
            <li key={r.title + r.org} className="border-t border-line">
              <details className="group" open={r.current}>
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 md:grid-cols-[13rem_1fr_16rem_auto] [&::-webkit-details-marker]:hidden">
                  <span className="label order-3 col-span-2 tabular-nums md:order-none md:col-span-1">{r.period}</span>
                  <span className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-[-0.015em]">
                    {r.title}
                    {r.current ? (
                      <span className="ml-3 inline-flex translate-y-[-3px] items-center gap-2 align-middle font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-signal">
                        <span className="signal-dot" aria-hidden /> Current
                      </span>
                    ) : null}
                  </span>
                  <span className="order-4 col-span-2 text-sm text-fg-2 md:order-none md:col-span-1">{r.org}</span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full border border-line-2 text-fg-2 transition-transform duration-500 group-open:rotate-45"
                  >
                    <Plus />
                  </span>
                </summary>
                <ul className="grid gap-x-10 gap-y-2 pb-8 text-[0.9375rem] leading-relaxed text-fg-2 md:ml-[13rem] md:grid-cols-2 md:pl-6">
                  {r.points.map((pt) => (
                    <li key={pt} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-fg-3">
                      {pt}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
          <li className="grid grid-cols-1 items-baseline gap-x-6 gap-y-1 border-t border-line py-6 md:grid-cols-[13rem_1fr_16rem_auto]">
            <span className="label tabular-nums">Education · {education.period}</span>
            <span className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-[-0.015em]">
              {education.school}
            </span>
            <span className="text-sm text-fg-2">{education.field}</span>
            <span />
          </li>
        </ol>
      </div>
    </section>
  );
}
