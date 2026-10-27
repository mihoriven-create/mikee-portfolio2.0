"use client";

import Image from "next/image";
import { useState } from "react";
import type { Shot } from "@/content/site";
import { Lightbox } from "./Lightbox";

const OFFSETS = ["md:ml-0", "md:ml-[7%]", "md:ml-[14%]"];

/** Wide workflow screenshots layered as offset plates; each opens full size. */
export function ShotStack({ shots, title }: { shots: Shot[]; title: string }) {
  const [zoom, setZoom] = useState<number | null>(null);
  return (
    <>
      <ul className="flex flex-col gap-3">
        {shots.map((s, k) => (
          <li
            key={s.src}
            data-reveal
            className={OFFSETS[k % OFFSETS.length]}
            style={{ "--d": `${k * 0.12}s` } as React.CSSProperties}
          >
            <figure className="frame group md:w-[86%]">
              <figcaption className="frame__bar">
                <span className="font-mono text-[10px] text-signal">0{k + 1}</span>
                <span className="min-w-0 truncate font-mono text-[11px] text-fg-3">{s.alt}</span>
              </figcaption>
              <button
                type="button"
                onClick={() => setZoom(k)}
                className="relative block aspect-[851/315] w-full cursor-zoom-in overflow-hidden bg-[#f6f7f9]"
                aria-label={`Open full-size screenshot: ${s.alt}`}
              >
                <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="shot-img object-cover" />
              </button>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox shots={shots} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} title={title} />
    </>
  );
}
