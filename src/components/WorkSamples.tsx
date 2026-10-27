"use client";

import Image from "next/image";
import { useState } from "react";
import type { WorkSample } from "@/content/site";
import { Lightbox } from "./work/Lightbox";
import { Expand } from "./ui/Icons";

/** Real Slack threads, shown as evidence rather than as polished quotes. */
export function WorkSamples({ samples }: { samples: WorkSample[] }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const shots = samples.map((s) => s.shot);

  return (
    <>
      <ul className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 xl:grid-cols-4">
        {samples.map((s, i) => (
          <li
            key={s.name}
            className="w-[82vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none"
            data-reveal
            style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
          >
            <figure className="flex h-full flex-col">
              <button
                type="button"
                onClick={() => setZoom(i)}
                className="frame group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-white"
                aria-label={`Open full-size screenshot: ${s.shot.alt}`}
              >
                <Image
                  src={s.shot.src}
                  alt={s.shot.alt}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 82vw"
                  className="shot-img object-cover object-left-top group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-xs text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand /> View
                </span>
              </button>
              <figcaption className="mt-4 flex flex-1 flex-col gap-3">
                <span className="label">{s.topic}</span>
                {s.quote ? <span className="text-[0.9375rem] leading-relaxed text-fg-2">“{s.quote}”</span> : null}
                <span className="mt-auto text-sm text-fg">— {s.name}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox shots={shots} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title="Work samples" />
    </>
  );
}
