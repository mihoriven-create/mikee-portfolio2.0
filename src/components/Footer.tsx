import { nav, profile } from "@/content/site";
import { ArrowUp } from "./ui/Icons";

export function Footer() {
  return (
    <footer className="shell pb-10 pt-6">
      {/* The signal line ends here. */}
      <div aria-hidden className="relative mb-10 h-px bg-line">
        <span className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-signal/50 to-signal" data-draw />
        <span className="signal-dot absolute -top-[2.5px] right-0" />
      </div>
      <div className="grid gap-8 text-sm text-fg-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <p className="text-fg">{profile.name}</p>
          <p>
            {profile.role} · {profile.location}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-u hover:text-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
          <a href="#top" className="inline-flex items-center gap-2 text-fg-2 hover:text-fg">
            <ArrowUp /> Back to top
          </a>
        </div>
      </div>
      <p className="mt-10 font-mono text-[11px] text-fg-3">© {profile.name}</p>
    </footer>
  );
}
