"use client";

import { useEffect } from "react";

const TRANSPARENT_VALUES = new Set([
  "transparent",
  "rgba(0, 0, 0, 0)",
  "rgba(0,0,0,0)",
]);

function visibleCanvasColorAtBottom(): string {
  const x = Math.max(1, Math.min(window.innerWidth - 2, Math.round(window.innerWidth / 2)));
  const y = Math.max(1, window.innerHeight - 2);
  let node = document.elementFromPoint(x, y) as HTMLElement | null;

  while (node && node !== document.documentElement) {
    const color = window.getComputedStyle(node).backgroundColor;
    if (color && !TRANSPARENT_VALUES.has(color)) return color;
    node = node.parentElement;
  }

  return window.getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim() || "#f5f2eb";
}

/**
 * Keeps Safari's document canvas aligned with the section touching the bottom
 * of the visual viewport. Safari samples this canvas behind its translucent
 * bottom controls; leaving it transparent exposes the browser's white backing
 * surface and creates a white strip / white fade below dark sections.
 */
export function DocumentCanvasTone() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (root.classList.contains("splashCanvasActive")) return;

      const color = visibleCanvasColorAtBottom();
      if (root.style.getPropertyValue("--document-canvas-color") === color) return;
      root.style.setProperty("--document-canvas-color", color);
      body.style.setProperty("--document-canvas-color", color);
      root.dataset.canvasTone = color;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      observer.disconnect();
      root.style.removeProperty("--document-canvas-color");
      body.style.removeProperty("--document-canvas-color");
      delete root.dataset.canvasTone;
    };
  }, []);

  return null;
}
