"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = window.localStorage.getItem("studio-theme");
    const nextDark = saved ? saved === "dark" : true;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    queueMicrotask(() => setDark(nextDark));
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("studio-theme", next ? "dark" : "light");
  }
  return <button className="icon-button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}
