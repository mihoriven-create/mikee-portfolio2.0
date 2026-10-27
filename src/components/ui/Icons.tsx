import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P): P => ({
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
  </svg>
);

export const ArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
  </svg>
);

export const ArrowUp = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M10 3 5 8l5 5" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 3 5 5-5 5" />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export const Expand = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
  </svg>
);

export const Download = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
  </svg>
);

export const Copy = (p: P) => (
  <svg {...base(p)}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="m3 8.5 3 3 7-7" />
  </svg>
);
