"use client";

import { useEffect } from "react";
import { visualViewportHeight } from "../lib/viewport";

const TRANSPARENT_VALUES = new Set([
  "transparent",
  "rgba(0, 0, 0, 0)",
  "rgba(0,0,0,0)",
]);

function cssToken(name: string, fallback: string): string {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}


function opaqueAncestorColor(node: Element | null): string | null {
  let current = node as HTMLElement | null;
  while (current && current !== document.documentElement) {
    const color = window.getComputedStyle(current).backgroundColor;
    if (color && !TRANSPARENT_VALUES.has(color)) return color;
    current = current.parentElement;
  }
  return null;
}

function sampledCanvasColor(): string | null {
  const visibleHeight = visualViewportHeight();
  const y = Math.max(1, Math.floor(visibleHeight - 3));
  const widths = [0.22, 0.5, 0.78];
  const colors = widths
    .map((ratio) => document.elementFromPoint(Math.max(1, Math.floor(window.innerWidth * ratio)), y))
    .map(opaqueAncestorColor)
    .filter((value): value is string => Boolean(value));

  if (!colors.length) return null;
  const counts = new Map<string, number>();
  for (const color of colors) counts.set(color, (counts.get(color) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function isAtDocumentBottom(): boolean {
  const viewport = window.visualViewport;
  const viewportBottom = window.scrollY + (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
  const layoutBottom = window.scrollY + document.documentElement.clientHeight;
  const documentBottom = document.documentElement.scrollHeight - 12;
  return viewportBottom >= documentBottom || layoutBottom >= documentBottom;
}

/**
 * Keeps Safari's document canvas aligned with the content touching the bottom
 * of the visual viewport. The sampler intentionally uses visualViewport.height
 * rather than window.innerHeight: during toolbar expansion Safari can report a
 * layout height that points outside elementFromPoint's valid coordinate space.
 * Invalid/transient samples retain the previous colour instead of falling back
 * to paper, eliminating the white block that appeared while the toolbar moved.
 */
export function DocumentCanvasTone() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;
    let lastApplied = root.style.getPropertyValue("--document-canvas-color") || cssToken("--color-paper", "#f5f2eb");
    let pendingColor: string | null = null;
    let pendingCount = 0;

    const apply = (color: string) => {
      if (color === lastApplied) return;
      lastApplied = color;
      root.style.setProperty("--document-canvas-color", color);
    };

    const update = () => {
      frame = 0;
      if (root.classList.contains("splashCanvasActive")) return;

      // The final page edge must stay black even while Safari resizes its
      // visual viewport and elementFromPoint temporarily returns no element.
      if (isAtDocumentBottom() && document.querySelector("#site-footer")) {
        pendingColor = null;
        pendingCount = 0;
        apply(cssToken("--color-dark", "#080808"));
        return;
      }

      const candidate = sampledCanvasColor();
      if (!candidate) return;

      if (candidate === pendingColor) pendingCount += 1;
      else {
        pendingColor = candidate;
        pendingCount = 1;
      }

      // Require two consistent frames before changing the native-chrome canvas.
      // This filters the one-frame paper sample Safari emits while its toolbar
      // switches between expanded and collapsed states.
      if (pendingCount >= 2) apply(candidate);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const scheduleTwice = () => {
      schedule();
      window.requestAnimationFrame(schedule);
    };

    scheduleTwice();
    window.addEventListener("scroll", scheduleTwice, { passive: true });
    window.addEventListener("resize", scheduleTwice, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleTwice, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleTwice, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleTwice);
      window.removeEventListener("resize", scheduleTwice);
      window.visualViewport?.removeEventListener("resize", scheduleTwice);
      window.visualViewport?.removeEventListener("scroll", scheduleTwice);
    };
  }, []);

  return null;
}
