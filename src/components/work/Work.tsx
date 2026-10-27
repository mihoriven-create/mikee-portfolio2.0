import { partners, projects, type Project } from "@/content/site";
import { SectionHead } from "../ui/SectionHead";
import { IntakeFlow } from "./demos/IntakeFlow";
import { LeadAge } from "./demos/LeadAge";
import { Dscr } from "./demos/Dscr";
import { TranscriptSummary } from "./demos/TranscriptSummary";
import { ProjectChapter } from "./ProjectChapter";
import { ShotStack } from "./ShotStack";
import { ShotViewer } from "./ShotViewer";
import { WorkMotion } from "./WorkMotion";

type Layout = "split" | "split-reverse" | "wide";

// Each case study gets the presentation that suits its evidence.
const presentation: Record<string, { layout: Layout; visual: (p: Project) => React.ReactNode }> = {
  "deal-intake": { layout: "split", visual: () => <IntakeFlow /> },
  "ghl-workflows": {
    layout: "wide",
    visual: (p) => <ShotViewer shots={p.shots!} title={p.title} variant="filmstrip" aspect="1800 / 930" />,
  },
  "ai-voice": {
    layout: "split-reverse",
    visual: (p) => (
      <div className="flex flex-col gap-6">
        <ShotStack shots={p.shots!} title={p.title} />
        <TranscriptSummary />
      </div>
    ),
  },
  "lead-age": { layout: "split", visual: () => <LeadAge /> },
  dscr: { layout: "split-reverse", visual: () => <Dscr /> },
  operations: {
    layout: "wide",
    visual: (p) => (
      <div>
        <ShotViewer shots={p.shots!} title={p.title} variant="index" aspect="1800 / 925" />
        <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-5">
          <span className="label">Partner organizations supported</span>
          {partners.map((name) => (
            <span key={name} className="text-sm text-fg-2">
              {name}
            </span>
          ))}
        </div>
      </div>
    ),
  },
};

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="shell scroll-mt-[var(--nav-h)] pt-12 md:pt-20">
      <SectionHead
        id="work-title"
        index="01"
        kicker="Selected work"
        lines={["Selected", "work"]}
        aside={
          <p>
            Six case studies from live CRM, automation and integration work. Screenshots are from the real systems, with
            contact details blurred; anything illustrative is labelled as such.
          </p>
        }
      />
      <div className="border-b border-line">
        {projects.map((p) => {
          const view = presentation[p.id];
          return (
            <ProjectChapter key={p.id} project={p} total={projects.length} layout={view.layout} visual={view.visual(p)} />
          );
        })}
      </div>
      <WorkMotion />
    </section>
  );
}
