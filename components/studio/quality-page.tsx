import { CheckCircle2, CircleDot, Code2, Keyboard, MonitorCheck, MoonStar, SearchCheck, ShieldCheck } from "lucide-react";
import { componentRegistry } from "@/lib/component-registry";

const checks = [
  { icon: Keyboard, title: "Keyboard access", detail: "Visible focus states, semantic controls and escape handling for global interactions." },
  { icon: MonitorCheck, title: "Responsive review", detail: "Every component can be inspected at desktop, tablet and mobile widths." },
  { icon: MoonStar, title: "Theme coverage", detail: "Shared tokens keep all documented blocks usable in light and dark themes." },
  { icon: SearchCheck, title: "Discoverability", detail: "Catalogue filters and global search provide direct access to every component route." },
  { icon: Code2, title: "Reusable APIs", detail: "Usage examples document public props instead of encouraging duplicated markup." },
  { icon: ShieldCheck, title: "Deployment baseline", detail: "Vite, pinned dependencies, Node 22 and Vercel SPA routing remain unchanged." },
];

export function QualityPage() {
  const categories = new Set(componentRegistry.map((item) => item.category)).size;
  return <div className="quality-page">
    <header className="quality-hero">
      <span>Release quality</span>
      <h1>Accessibility, QA and component API refinement</h1>
      <p>Version 0.9.0 strengthens the library as a dependable product baseline before the stable 1.0 release.</p>
    </header>
    <section className="quality-stats" aria-label="Library quality summary">
      <article><strong>{componentRegistry.length}</strong><span>documented entries</span></article>
      <article><strong>{categories}</strong><span>library categories</span></article>
      <article><strong>3</strong><span>responsive preview modes</span></article>
      <article><strong>2</strong><span>supported themes</span></article>
    </section>
    <section className="quality-grid">
      {checks.map(({icon: Icon,title,detail}) => <article key={title}><Icon/><div><strong>{title}</strong><p>{detail}</p></div><CheckCircle2 className="quality-check"/></article>)}
    </section>
    <section className="quality-release">
      <div><CircleDot/><span><strong>v0.9.0 readiness</strong><small>Foundation prepared for stable API review</small></span></div>
      <a href="/#library">Review component library</a>
    </section>
  </div>;
}
