"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SurfaceTone = "light" | "dark";

type SafariUiColorContextValue = {
  menuActive: boolean;
  setSurfaceTone: (tone: SurfaceTone) => void;
  setMenuActive: (active: boolean) => void;
  setAtBottom: (active: boolean) => void;
  setSplashActive: (active: boolean) => void;
};

const SafariUiColorContext = createContext<SafariUiColorContextValue | null>(null);

const PAPER = "#f5f2eb";
const DARK = "#090909";

/**
 * Single owner for Safari's document-canvas / toolbar fallback color.
 * Priority: splash (paper) -> menu (dark) -> real page bottom (dark) ->
 * section beneath the header (light/dark).
 */
export function SafariUiColorProvider({ children }: { children: ReactNode }) {
  const [surfaceTone, setSurfaceToneState] = useState<SurfaceTone>("light");
  const [menuActive, setMenuActiveState] = useState(false);
  const [atBottom, setAtBottomState] = useState(false);
  const [splashActive, setSplashActiveState] = useState(true);

  const resolvedTone: SurfaceTone = splashActive
    ? "light"
    : menuActive || atBottom || surfaceTone === "dark"
      ? "dark"
      : "light";

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const color = resolvedTone === "dark" ? DARK : PAPER;

    // Safari 26 observes the actual inline backgroundColor on <body>.
    // Updating a custom property inherited by body is not reliably detected,
    // so set the concrete colors directly on both root elements.
    root.style.backgroundColor = color;
    body.style.backgroundColor = color;
    root.dataset.safariUiTone = resolvedTone;
    body.dataset.safariUiTone = resolvedTone;
  }, [resolvedTone]);

  const setSurfaceTone = useCallback((tone: SurfaceTone) => {
    setSurfaceToneState((current) => (current === tone ? current : tone));
  }, []);

  const setMenuActive = useCallback((active: boolean) => {
    setMenuActiveState((current) => (current === active ? current : active));
  }, []);

  const setAtBottom = useCallback((active: boolean) => {
    setAtBottomState((current) => (current === active ? current : active));
  }, []);

  const setSplashActive = useCallback((active: boolean) => {
    setSplashActiveState((current) => (current === active ? current : active));
  }, []);

  const value = useMemo(
    () => ({ menuActive, setSurfaceTone, setMenuActive, setAtBottom, setSplashActive }),
    [menuActive, setSurfaceTone, setMenuActive, setAtBottom, setSplashActive],
  );

  return <SafariUiColorContext.Provider value={value}>{children}</SafariUiColorContext.Provider>;
}

export function useSafariUiColor() {
  const context = useContext(SafariUiColorContext);
  if (!context) {
    throw new Error("useSafariUiColor must be used inside SafariUiColorProvider");
  }
  return context;
}
