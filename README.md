# Michael John Buencamino — Portfolio 2.0

Cinematic single-page portfolio. Next.js 16 (App Router, fully static), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (static)
npm run lint
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Contact form delivery via Web3Forms. Use the same key as the current production site. Without it, the form shows a "please email me directly" fallback. |

## Where things live

- `src/content/site.ts` — **all copy and data** (profile, projects, capabilities, experience, testimonials). Edit content here only.
- `src/app/globals.css` — design tokens (colors, easing, spacing), primitives, intro and reveal styles.
- `src/components/hero` — intro letterbox (pure CSS), hero, signal-path figure, local time.
- `src/components/work` — case-study chapter layout, screenshot viewers, lightbox and the interactive demos (`demos/`).
- `src/components/motion/MotionProvider.tsx` — Lenis smooth scroll + one IntersectionObserver for `data-reveal`, `data-mask`, `data-draw`.
- `public/work`, `public/logos`, `public/images` — screenshots and images carried over from the previous site.

## Motion rules

- One easing (`--ease-out`, expo-out); durations 0.35 / 0.7 / 1.1s.
- Reveals are CSS transitions toggled by `.is-in`; hidden states apply only when `<html class="js">`, so content never depends on JS.
- Scroll-scrubbed effects (hero exit, statement, case-study parallax) use GSAP ScrollTrigger and are skipped under `prefers-reduced-motion`.
- Lenis runs only for fine pointers and is disabled for reduced motion; dialogs scroll natively.
