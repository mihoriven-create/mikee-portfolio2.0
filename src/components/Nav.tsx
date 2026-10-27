"use client";

import { useEffect, useRef, useState } from "react";
import { nav, profile } from "@/content/site";
import { ArrowUpRight, Close } from "./ui/Icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          scrolled ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a href="#top" className="group flex items-center gap-3">
            <Monogram />
            <span className="sr-only text-sm font-medium tracking-tight text-fg sm:not-sr-only">{profile.name}</span>
            <span className="sr-only">, back to top</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item, i) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`group flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                        isActive ? "text-fg" : "text-fg-2 hover:text-fg"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] transition-colors duration-300 ${
                          isActive ? "text-signal" : "text-fg-3"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profile.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn hidden !min-h-10 !px-4 text-sm sm:inline-flex"
            >
              Book a call <ArrowUpRight className="arrow" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <button
              type="button"
              onClick={openMenu}
              className="flex h-10 items-center gap-3 rounded-full border border-line-2 px-4 text-sm lg:hidden"
              aria-haspopup="dialog"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <i className="block h-px w-4 bg-fg" />
                <i className="block h-px w-4 bg-fg" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Site menu"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink text-fg backdrop:bg-ink open:flex open:flex-col"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) closeMenu();
        }}
      >
        <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between">
          <span className="label">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 items-center gap-2 rounded-full border border-line-2 px-4 text-sm"
          >
            <Close /> Close
          </button>
        </div>
        <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item, i) => (
              <li key={item.id} className="menu-item" style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={`#${item.id}`}
                  className="flex items-baseline justify-between py-5 text-[clamp(2rem,9vw,3.5rem)] font-display font-extrabold uppercase leading-none tracking-tight"
                >
                  {item.label}
                  <span className="font-mono text-xs text-fg-3">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="shell flex shrink-0 flex-wrap gap-x-6 gap-y-2 pb-8 pt-6 text-sm text-fg-2">
          <a href={`mailto:${profile.email}`} className="link-u">
            {profile.email}
          </a>
          <a href={profile.calendly} target="_blank" rel="noopener noreferrer" className="link-u">
            Book a call<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </dialog>
    </>
  );
}

function Monogram() {
  return (
    <span
      aria-hidden
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line-2 font-display text-[11px] font-extrabold tracking-tight transition-colors duration-500 group-hover:border-signal"
    >
      MJB
      <span className="signal-dot absolute -right-0.5 top-1 !h-[5px] !w-[5px]" />
    </span>
  );
}
