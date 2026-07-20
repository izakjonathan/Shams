import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { componentRegistry } from "@/lib/component-registry";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return componentRegistry.filter((item) =>
      `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(value),
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        rootRef.current?.querySelector("input")?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div className="global-search" ref={rootRef}>
      <label className="search-box">
        <Search size={17}/>
        <input
          aria-label="Search components"
          aria-expanded={open}
          aria-controls="global-search-results"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          placeholder="Search components…"
        />
        <kbd>⌘K</kbd>
      </label>
      {open && query.trim() && (
        <div className="global-search__results" id="global-search-results" role="listbox">
          {results.length ? results.map((item) => (
            <a href={`/components/${item.slug}`} key={item.slug} role="option">
              <span><strong>{item.title}</strong><small>{item.category}</small></span>
              <small>{item.status}</small>
            </a>
          )) : <p>No matching components.</p>}
        </div>
      )}
    </div>
  );
}
