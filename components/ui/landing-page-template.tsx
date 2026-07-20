import { ArrowRight, Check, Menu, Sparkles } from "lucide-react";

export function LandingPageTemplate() {
  return (
    <section className="template template--landing">
      <header className="template-nav">
        <strong><span>SU</span> Northstar</strong>
        <nav><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#about">About</a></nav>
        <button className="template-icon-button" aria-label="Open menu"><Menu size={18}/></button>
      </header>
      <div className="landing-hero">
        <span className="template-eyebrow"><Sparkles size={14}/> Built for ambitious teams</span>
        <h2>Turn complicated work into a clear daily rhythm.</h2>
        <p>A polished marketing-page composition with reusable navigation, proof points, calls to action and responsive sections.</p>
        <div className="template-actions"><button>Start free <ArrowRight size={16}/></button><button className="is-secondary">Book a demo</button></div>
        <div className="landing-proof"><span><Check size={14}/> No card required</span><span><Check size={14}/> Setup in minutes</span><span><Check size={14}/> Cancel anytime</span></div>
      </div>
      <div className="landing-dashboard">
        <aside><span/><span/><span/></aside>
        <div><header><b>Workspace overview</b><small>Last 30 days</small></header><div className="landing-metrics"><i/><i/><i/></div><div className="landing-chart"/></div>
      </div>
    </section>
  );
}
