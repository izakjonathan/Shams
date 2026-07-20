"use client";

import { ArrowRight, Heart, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { componentRegistry } from "@/lib/component-registry";

export function ComponentBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const categories = ["All", ...Array.from(new Set(componentRegistry.map((item) => item.category)))];
  const visible = useMemo(() => componentRegistry.filter((item) => {
    const matchesQuery = `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const favorite = localStorage.getItem(`studio-ui:favorite:${item.slug}`) === "1";
    return matchesQuery && (category === "All" || item.category === category) && (!favoritesOnly || favorite);
  }), [query, category, favoritesOnly]);

  return <section className="browser-section" id="library">
    <div className="browser-toolbar">
      <label className="browser-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" /></label>
      <div className="category-pills">{categories.map((item) => <button key={item} className={item === category ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}<button className={favoritesOnly ? "is-active" : ""} onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}><Heart size={14}/> Saved</button></div>
    </div>
    <div className="library-grid">
      {visible.map((item) => <a className="library-card" href={`/components/${item.slug}`} key={item.slug}>
        <div className="library-card__preview">{item.preview}</div>
        <div className="library-card__meta"><span>{item.category}</span><strong>{item.title}</strong><p>{item.description}</p><small><span>{item.maturity} · {item.status}</span><ArrowRight size={14}/></small></div>
      </a>)}
    </div>
    {!visible.length && <div className="empty-results">No components match that search.</div>}
  </section>;
}
