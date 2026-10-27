"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Shot } from "@/content/site";
import { ChevronLeft, ChevronRight, Close } from "../ui/Icons";

type Props = {
  shots: Shot[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  title: string;
};

/** Full-size screenshot viewer on a native modal <dialog> (focus trap + Esc for free). */
export function Lightbox({ shots, index, onIndex, onClose, title }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const shot = index !== null ? shots[index] : null;
  const many = shots.length > 1;
  const go = (delta: number) => {
    if (index === null) return;
    onIndex((index + delta + shots.length) % shots.length);
  };

  return (
    <dialog
      ref={ref}
      aria-label={`${title} — screenshot viewer`}
      onClose={onClose}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto max-h-[94dvh] w-[min(1400px,94vw)] max-w-none bg-transparent p-0 text-fg"
    >
      {shot ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="label min-w-0 truncate text-fg-2">
              {title} · {String((index ?? 0) + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-line-2 bg-ink px-4 text-sm"
              autoFocus
            >
              <Close /> Close
            </button>
          </div>
          <figure className="frame">
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="94vw"
              className="h-auto max-h-[74dvh] w-full bg-white object-contain"
            />
            <figcaption className="border-t border-line px-4 py-3 text-sm text-fg-2">{shot.alt}</figcaption>
          </figure>
          {many ? (
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => go(-1)} className="btn !min-h-11 !px-4" aria-label="Previous screenshot">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => go(1)} className="btn !min-h-11 !px-4" aria-label="Next screenshot">
                <ChevronRight />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
