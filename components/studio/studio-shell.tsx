import { Box, Component, Frame, Home, Menu, PackageCheck, Palette, Search, Shapes, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { GlobalSearch } from "./global-search";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/#overview", label: "Overview", icon: Home },
  { href: "/#foundation", label: "Foundation", icon: Palette },
  { href: "/#library", label: "All components", icon: Component },
  { href: "/#library", label: "Cards", icon: Box },
  { href: "/#library", label: "Forms", icon: Shapes },
  { href: "/#library", label: "Navigation", icon: Frame },
  { href: "/#library", label: "Data", icon: Search },
  { href: "/#library", label: "Business", icon: Box },
  { href: "/quality", label: "Quality report", icon: ShieldCheck },
  { href: "/release", label: "v1.0 release", icon: PackageCheck },
];

export function StudioShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="studio-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="brand"><span>SU</span><div><strong>Studio UI</strong><small>v1.0.1</small></div><button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
        <nav>{links.map(({href,label,icon:Icon}) => <a href={href} key={`${href}-${label}`} onClick={() => setOpen(false)}><Icon size={18}/>{label}</a>)}</nav>
        <div className="sidebar-note"><strong>Reusable by design</strong><span>Build client products from documented, proven blocks.</span></div>
      </aside>
      {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <div className="studio-main">
        <header className="topbar"><button className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><GlobalSearch/><ThemeToggle /></header>
        <main id="main-content">{children}</main>
      </div>
    </div>
  );
}
