"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DocumentCanvasTone } from "./DocumentCanvasTone";
import { RouteFade } from "./RouteFade";
import { SplashScreen } from "./SplashScreen";

export function AppShell({ children, header, footer }: { children: ReactNode; header: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) return;
    const root = document.documentElement;
    const paper = getComputedStyle(root).getPropertyValue("--color-paper").trim() || "#f5f2eb";
    document.body.classList.remove("splashActive", "splashHandoff", "splashExiting", "splashComplete");
    root.classList.remove("splashCanvasActive", "splashCanvasHandoff", "splashSessionSeen", "documentCanvasAtFooter");
    root.style.setProperty("--document-canvas-color", paper);
    root.style.backgroundColor = paper;
    document.body.style.backgroundColor = paper;
  }, [isAdmin]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <SplashScreen />
      <DocumentCanvasTone />
      <div className="siteShell">
        <RouteFade header={header}>{children}{footer}</RouteFade>
      </div>
    </>
  );
}
