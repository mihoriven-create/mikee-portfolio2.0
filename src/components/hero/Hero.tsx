import { profile } from "@/content/site";
import { ArrowDown, ArrowRight, Download } from "../ui/Icons";
import { HeroMotion } from "./HeroMotion";
import { LocalTime } from "./LocalTime";
import { SignalPath } from "./SignalPath";

function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="hero-ch" style={{ "--i": i + offset } as React.CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Lighting: one soft key light and a fading blueprint grid. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blueprint absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent_75%)]" />
        <div className="absolute -top-1/3 left-1/2 h-[90vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(255_255_255/0.07),transparent)]" />
      </div>

      <div className="shell flex min-h-[calc(100svh-var(--nav-h))] flex-col pb-10 pt-8 md:pb-14 md:pt-14">
        <div className="hero-fade flex flex-wrap items-center justify-between gap-x-8 gap-y-2" style={{ "--d": "0.2s" } as React.CSSProperties}>
          <p className="label flex items-center gap-3 text-fg-2">
            <span className="signal-dot" aria-hidden />
            {profile.role}
          </p>
          <p className="label">
            {profile.location} · <LocalTime /> local time
          </p>
        </div>

        <h1 id="hero-title" className="mt-10 md:mt-14" data-hero-name>
          <span className="sr-only">
            {profile.name} — {profile.role}
          </span>
          <span aria-hidden className="display block">
            <span className="hero-line text-[clamp(2.1rem,6.1vw,7.25rem)] text-fg-2">
              <Chars text="Michael John" />
            </span>
            {/* "BUENCAMINO" measures ~7.85em at this width/tracking; sized to span the shell. */}
            <span className="hero-line text-[clamp(2.4rem,11.4vw,12.2rem)] tracking-[-0.035em]">
              <Chars text="Buencamino" offset={6} />
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
          {/* Painted at first render (no fade) so it can be the LCP element; the intro letterbox reveals it. */}
          <p
            className="font-display text-[clamp(1.6rem,2.7vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.02em] md:col-span-6"
            style={{ fontStretch: "100%" }}
          >
            I connect the tools a business runs on — and make them work as{" "}
            <span className="text-signal">one system.</span>
          </p>

          <div className="flex flex-col gap-8 md:col-span-5 md:col-start-8">
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-fg-2">
              CRM administration in GoHighLevel and Zoho, SMS, email and AI workflow automation, API and
              webhook integrations, and custom web tools — built and maintained for US-based businesses.
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-3" style={{ "--d": "0.7s" } as React.CSSProperties}>
              <a href="#work" className="btn btn-primary">
                Explore selected work <ArrowDown className="arrow" />
              </a>
              <a href="#contact" className="btn">
                Start a conversation <ArrowRight className="arrow" />
              </a>
              <a
                href={profile.resume}
                className="link-u ml-1 inline-flex items-center gap-2 py-2 text-sm text-fg-2 hover:text-fg"
                download
              >
                <Download /> Résumé (PDF)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-16 md:pt-20">
          <SignalPath />
        </div>
      </div>

      <HeroMotion />
    </section>
  );
}
