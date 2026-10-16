"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RouteFade } from "./RouteFade";
import { SplashScreen } from "./SplashScreen";
import { LowerSectionReveal } from "./LowerSectionReveal";

export function AppShell({ children, header, footer }: { children: ReactNode; header: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) return;
    const root = document.documentElement;
    const canvas = "#000000";
    document.body.classList.remove("splashActive", "splashHandoff", "splashExiting", "splashComplete");
    root.classList.remove("splashCanvasActive", "splashCanvasHandoff", "splashSessionSeen");
    root.style.setProperty("--document-canvas-color", canvas);
    root.style.backgroundColor = canvas;
    document.body.style.backgroundColor = canvas;
  }, [isAdmin]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <SplashScreen />
      <LowerSectionReveal />
      <div className="siteShell">
        <RouteFade header={header}>{children}{footer}</RouteFade>
      </div>
    </>
  );
}
