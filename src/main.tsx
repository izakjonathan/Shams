import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight, ChartNoAxesCombined, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { ComponentBrowser } from "@/components/studio/component-browser";
import { ComponentDetail } from "@/components/studio/component-detail";
import { StudioShell } from "@/components/studio/studio-shell";
import { QualityPage } from "@/components/studio/quality-page";
import { ReleasePage } from "@/components/studio/release-page";
import { componentRegistry } from "@/lib/component-registry";
import "../globals.css";

function Home() {
  return (
    <StudioShell>
      <section className="hero" id="overview">
        <div><span className="hero-kicker"><Sparkles size={15}/> Stable component-library release</span><h1>Browse, test and reuse your own interface library.</h1><p>Studio UI v1.0.0 is the first stable baseline: searchable, documented, reusable and ready to become the foundation for client products.</p><div className="hero-actions"><a className="primary-link" href="#library">Browse library <ArrowRight size={17}/></a><a className="secondary-link" href="#foundation">View foundation</a></div></div>
        <div className="hero-panel"><div><Layers3/><strong>{componentRegistry.length} documented entries</strong><span>Dedicated detail pages</span></div><div><ShieldCheck/><strong>Preview controls</strong><span>Desktop, tablet and mobile</span></div><div><ChartNoAxesCombined/><strong>Searchable library</strong><span>Ready to expand release by release</span></div></div>
      </section>
      <section className="content-section" id="foundation"><div className="section-header"><span>Foundation</span><h2>Consistent tokens and reusable APIs</h2><p>Shared colour, spacing, radius, typography and elevation decisions control the visual language.</p></div><div className="token-grid"><div><span>Background</span><b className="swatch swatch--bg"/></div><div><span>Surface</span><b className="swatch swatch--surface"/></div><div><span>Accent</span><b className="swatch swatch--accent"/></div><div><span>Success</span><b className="swatch swatch--success"/></div><div><span>Radius</span><strong>8 / 14 / 22</strong></div><div><span>Spacing</span><strong>4 / 8 / 12 / 16 / 24</strong></div></div></section>
      <section className="content-section"><div className="section-header"><span>Library</span><h2>Find a block and inspect it properly</h2><p>Filter by category, open a dedicated page, change the preview width and copy the intended usage.</p></div><ComponentBrowser/></section>
    </StudioShell>
  );
}

function App() {
  if (window.location.pathname === "/quality" || window.location.pathname === "/quality/") return <StudioShell><QualityPage/></StudioShell>;
  if (window.location.pathname === "/release" || window.location.pathname === "/release/") return <StudioShell><ReleasePage/></StudioShell>;
  const match = window.location.pathname.match(/^\/components\/([^/]+)\/?$/);
  if (match) {
    const entry = componentRegistry.find((item) => item.slug === match[1]);
    if (entry) return <StudioShell><ComponentDetail entry={entry}/></StudioShell>;
  }
  return <Home />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
