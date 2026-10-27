import Image from "next/image";
import { testimonials, workSamples } from "@/content/site";
import { SectionHead } from "./ui/SectionHead";
import { WorkSamples } from "./WorkSamples";

export function Testimonials() {
  const [feature, ...rest] = testimonials;
  return (
    <section id="feedback" aria-labelledby="feedback-title" className="shell scroll-mt-[var(--nav-h)] py-28 md:py-40">
      <SectionHead id="feedback-title" index="04" kicker="Professional feedback" lines={["In their", "words"]} />

      <figure className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-10 md:pt-16">
        <div className="lg:col-span-3">
          <Attribution name={feature.name} org={feature.org} logo={feature.logo} />
        </div>
        <blockquote className="lg:col-span-9">
          <p
            className="font-display text-[clamp(1.5rem,3vw,2.9rem)] font-medium leading-[1.18] tracking-[-0.02em] text-fg"
            data-reveal
          >
            <span aria-hidden className="text-signal">
              “
            </span>
            {feature.quote}
            <span aria-hidden className="text-signal">
              ”
            </span>
          </p>
        </blockquote>
      </figure>

      <div className="mt-20 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
        {rest.map((t, i) => (
          <figure
            key={t.name}
            className="flex flex-col justify-between gap-10 bg-ink p-7 md:p-10"
            data-reveal
            style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
          >
            <blockquote>
              <p className="text-[clamp(1.1rem,1.5vw,1.35rem)] leading-relaxed text-fg">“{t.quote}”</p>
            </blockquote>
            <Attribution name={t.name} org={t.org} logo={t.logo} />
          </figure>
        ))}
      </div>

      <div className="mt-28 md:mt-36">
        <div className="mb-6 flex items-center gap-4">
          <h3 className="label text-fg-2">From the work itself</h3>
          <span className="rule flex-1" data-draw aria-hidden />
        </div>
        <p className="mb-10 max-w-2xl text-fg-2">
          Messages, project updates and troubleshooting threads with clients, partners and teammates across CRM,
          automation and operations work.
        </p>
        <WorkSamples samples={workSamples} />
      </div>
    </section>
  );
}

function Attribution({ name, org, logo }: { name: string; org: string; logo?: string }) {
  return (
    <figcaption className="flex items-center gap-4">
      {logo ? (
        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-line-2 bg-white p-1.5">
          <Image src={logo} alt={`${org} logo`} width={40} height={40} className="h-auto w-full object-contain" />
        </span>
      ) : null}
      <span>
        <span className="block font-medium text-fg">{name}</span>
        <span className="block text-sm text-fg-3">{org}</span>
      </span>
    </figcaption>
  );
}
