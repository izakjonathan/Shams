import { CheckCircle2, Download, PackageCheck, ShieldCheck } from "lucide-react";
import { componentRegistry } from "@/lib/component-registry";

export function ReleasePage() {
  const categories = Array.from(new Set(componentRegistry.map((item) => item.category)));
  const stable = componentRegistry.filter((item) => item.maturity === "stable").length;
  function downloadManifest() {
    const manifest = componentRegistry.map(({ preview: _preview, ...entry }) => entry);
    const url = URL.createObjectURL(new Blob([JSON.stringify({ name: "Studio UI", version: "1.0.0", components: manifest }, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "studio-ui-manifest.json"; anchor.click(); URL.revokeObjectURL(url);
  }
  return <div className="release-page">
    <section className="release-hero"><span>Stable release</span><h1>Studio UI v1.0.1</h1><p>The first stable baseline for composing client websites and applications from documented, locally owned React components.</p><button onClick={downloadManifest}><Download size={17}/> Download manifest</button></section>
    <section className="release-stats"><article><strong>{componentRegistry.length}</strong><span>Documented entries</span></article><article><strong>{categories.length}</strong><span>Component categories</span></article><article><strong>{stable}</strong><span>Stable components</span></article><article><strong>0</strong><span>Runtime UI dependencies</span></article></section>
    <section className="release-grid"><article><PackageCheck/><div><h2>Owned source</h2><p>Every component lives inside the repository and can be adapted without waiting for an external package release.</p></div></article><article><ShieldCheck/><div><h2>Stable contract</h2><p>Every registry entry now includes source location, dependencies, maturity and accessibility guidance.</p></div></article><article><CheckCircle2/><div><h2>Release standard</h2><p>New additions should include responsive behavior, keyboard support, documentation and a reusable public API.</p></div></article></section>
    <section className="release-categories"><header><span>Coverage</span><h2>Library categories</h2></header><div>{categories.map((category) => <span key={category}>{category}<b>{componentRegistry.filter((item) => item.category === category).length}</b></span>)}</div></section>
  </div>;
}
