"use client";

import { useRef, useState } from "react";
import { profile } from "@/content/site";
import { ArrowRight, ArrowUpRight, Check, Copy, Download } from "../ui/Icons";
import { ContactDialog, type ContactDialogHandle } from "./ContactDialog";

const rowClass =
  "group relative isolate grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-t border-line py-6 text-left md:grid-cols-[4rem_1fr_1fr_auto] md:py-8";

function RowInner({ n, channel, detail, icon }: { n: string; channel: string; detail: string; icon: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="font-mono text-xs text-fg-3 transition-colors group-hover:text-signal">{n}</span>
      <span className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-bold leading-none tracking-[-0.025em]">
        {channel}
      </span>
      <span className="col-start-2 row-start-2 text-sm text-fg-2 md:col-start-auto md:row-start-auto md:text-base">
        {detail}
      </span>
      <span className="col-start-3 row-span-2 row-start-1 grid h-12 w-12 place-items-center rounded-full border border-line-2 transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-out)] group-hover:-rotate-0 group-hover:border-fg group-hover:bg-fg group-hover:text-ink md:col-start-auto md:row-span-1 md:row-start-auto">
        {icon}
      </span>
    </>
  );
}

export function Contact() {
  const dialog = useRef<ContactDialogHandle>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate scroll-mt-[var(--nav-h)] overflow-hidden pb-16 pt-28 md:pt-44"
    >
      <div aria-hidden className="scene-fallback pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-[-30%] left-1/2 h-[80vh] w-[110vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(139_227_247/0.07),transparent)]" />
      </div>

      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="label text-fg-2">(05)</span>
          <span className="label">Contact</span>
          <span className="rule flex-1" data-draw aria-hidden />
        </div>

        <h2 id="contact-title" className="display mt-10 text-[clamp(3.2rem,12.5vw,14.5rem)] md:mt-14">
          <span data-mask>
            <span>Let&apos;s build</span>
          </span>
          <span data-mask style={{ "--d": "0.1s" } as React.CSSProperties}>
            <span>
              better <span className="text-signal">systems.</span>
            </span>
          </span>
        </h2>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-fg-2 md:col-span-6" data-reveal>
            Need help with CRM management, workflow automation, AI implementation, or backend operations? Reach out
            through any channel below.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:col-span-5 md:col-start-8 md:justify-self-end" data-reveal>
            <a href={`mailto:${profile.email}`} className="link-u text-lg text-fg">
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-line-2 px-3 py-1.5 text-xs text-fg-2 transition-colors hover:border-fg hover:text-fg"
            >
              {copied ? <Check /> : <Copy />}
              <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
            </button>
          </div>
        </div>

        <ul className="mt-16 border-b border-line md:mt-24">
          <li>
            <button type="button" className={rowClass} onClick={() => dialog.current?.open()} aria-haspopup="dialog">
              <RowInner n="01" channel="Email me" detail="Opens a short message form" icon={<ArrowRight />} />
            </button>
          </li>
          <li>
            <a href={profile.whatsapp.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
              <RowInner n="02" channel="WhatsApp" detail={profile.whatsapp.label} icon={<ArrowUpRight />} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.calendly} target="_blank" rel="noopener noreferrer" className={rowClass}>
              <RowInner n="03" channel="Book a call" detail="30-minute call on Calendly" icon={<ArrowUpRight />} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={profile.resume} download className={rowClass}>
              <RowInner n="04" channel="Résumé" detail="Download the PDF" icon={<Download />} />
            </a>
          </li>
        </ul>
      </div>

      <ContactDialog ref={dialog} />
    </section>
  );
}
