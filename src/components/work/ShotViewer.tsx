"use client";

import Image from "next/image";
import { useState } from "react";
import type { Shot } from "@/content/site";
import { ChevronLeft, ChevronRight, Expand } from "../ui/Icons";
import { Lightbox } from "./Lightbox";

type Props = {
  shots: Shot[];
  title: string;
  /** filmstrip: large frame + thumbnails. index: caption list beside the frame. */
  variant: "filmstrip" | "index";
  aspect: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function ShotViewer({ shots, title, variant, aspect }: Props) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const shot = shots[i];
  const go = (d: number) => setI((v) => (v + d + shots.length) % shots.length);

  const frame = (
    <div
      className="frame"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="frame__bar">
        <span className="frame__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="min-w-0 truncate font-mono text-[11px] text-fg-3">{shot.alt}</span>
        <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-fg-2" aria-hidden>
          {pad(i + 1)} / {pad(shots.length)}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setZoom(i)}
        className="group relative block w-full cursor-zoom-in overflow-hidden bg-[#f6f7f9]"
        style={{ aspectRatio: aspect }}
        aria-label={`Open full-size screenshot: ${shot.alt}`}
      >
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="shot-img animate-[fade-up_.6s_var(--ease-out)] object-contain group-hover:scale-[1.015]"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-xs text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand /> Full size
        </span>
      </button>
      <p className="sr-only" aria-live="polite">
        Screenshot {i + 1} of {shots.length}: {shot.alt}
      </p>
    </div>
  );

  const controls = (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => go(-1)} className="btn !min-h-11 !px-4" aria-label="Previous screenshot">
        <ChevronLeft />
      </button>
      <button type="button" onClick={() => go(1)} className="btn !min-h-11 !px-4" aria-label="Next screenshot">
        <ChevronRight />
      </button>
    </div>
  );

  const lightbox = (
    <Lightbox shots={shots} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title={title} />
  );

  if (variant === "index") {
    return (
      <div className="grid gap-8 lg:grid-cols-12">
        <ol className="order-2 min-w-0 lg:order-1 lg:col-span-4" aria-label="Screenshots">
          {shots.map((s, k) => (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-current={k === i ? "true" : undefined}
                className={`group flex w-full items-baseline gap-4 border-t border-line py-3 text-left text-sm transition-colors duration-300 ${
                  k === i ? "text-fg" : "text-fg-3 hover:text-fg-2"
                }`}
              >
                <span className={`font-mono text-[11px] ${k === i ? "text-signal" : ""}`}>{pad(k + 1)}</span>
                <span className="leading-snug">{s.alt.replace(/ \(contact details blurred\)/, "")}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-8">
          {frame}
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="label">Contact details blurred in the originals</p>
            {controls}
          </div>
        </div>
        {lightbox}
      </div>
    );
  }

  return (
    <div>
      {frame}
      <div className="mt-4 flex items-center gap-4">
        <ul className="no-scrollbar flex flex-1 gap-2 overflow-x-auto py-1" aria-label="Screenshots">
          {shots.map((s, k) => (
            <li key={s.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show screenshot ${k + 1}: ${s.alt}`}
                aria-current={k === i ? "true" : undefined}
                className={`relative block h-12 w-20 overflow-hidden rounded-[4px] border bg-[#f6f7f9] transition-[border-color,opacity] duration-300 ${
                  k === i ? "border-signal opacity-100" : "border-line-2 opacity-45 hover:opacity-80"
                }`}
              >
                <Image src={s.src} alt="" fill sizes="80px" className="object-cover object-left-top" />
              </button>
            </li>
          ))}
        </ul>
        {controls}
      </div>
      {lightbox}
    </div>
  );
}
