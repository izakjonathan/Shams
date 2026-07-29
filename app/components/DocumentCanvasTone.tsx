"use client";

import { useEffect } from "react";
import { visualViewportHeight } from "../lib/viewport";

const TRANSPARENT_VALUES = new Set(["transparent", "rgba(0, 0, 0, 0)", "rgba(0,0,0,0)"]);
const SETTLE_DELAY_MS = 90;

function cssToken(name: string, fallback: string): string {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function isIOSWebKit(): boolean {
  return /iP(?:hone|ad|od)/.test(navigator.userAgent) && navigator.maxTouchPoints > 0;
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
  const viewport = window.visualViewport;
  const visibleHeight = visualViewportHeight();
  const visibleWidth = Math.max(1, viewport?.width ?? document.documentElement.clientWidth);
  const y = Math.max(1, Math.floor(visibleHeight - 3));
  const colors = [0.22, 0.5, 0.78]
    .map((ratio) => document.elementFromPoint(Math.max(1, Math.floor(visibleWidth * ratio)), y))
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
 * Keeps the iOS WebKit document canvas aligned with the content touching the
 * bottom of the visual viewport. Work is coalesced to one animation frame per
 * event burst, followed by one settled sample after Safari finishes moving its
 * toolbar. Invalid samples retain the last valid colour.
 */
export function DocumentCanvasTone() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const paper = cssToken("--color-paper", "#f5f2eb");

    // Other engines do not need the dynamic native-chrome workaround. Keeping
    // the explicit server-rendered paper canvas avoids unnecessary scroll work.
    if (!isIOSWebKit()) {
      root.style.backgroundColor = paper;
      body.style.backgroundColor = paper;
      return () => {
        root.style.removeProperty("background-color");
        body.style.removeProperty("background-color");
      };
    }

    let frame = 0;
    let settleTimer = 0;
    let lastApplied = root.style.backgroundColor || paper;
    let pendingColor: string | null = null;
    let pendingCount = 0;

    const apply = (color: string, force = false) => {
      if (!force && color === lastApplied) return;
      lastApplied = color;
      root.style.setProperty("--document-canvas-color", color);
      root.style.backgroundColor = color;
      body.style.backgroundColor = color;
    };

    const update = () => {
      frame = 0;
      if (root.classList.contains("splashCanvasActive")) return;

      if (isAtDocumentBottom() && document.getElementById("site-footer")) {
        pendingColor = null;
        pendingCount = 0;
        root.classList.add("documentCanvasAtFooter");
        apply(cssToken("--color-dark", "#080808"), true);
        return;
      }

      root.classList.remove("documentCanvasAtFooter");
      const candidate = sampledCanvasColor();
      if (!candidate) return;

      if (candidate === pendingColor) pendingCount += 1;
      else {
        pendingColor = candidate;
        pendingCount = 1;
      }

      if (pendingCount >= 2) apply(candidate);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!frame) frame = window.requestAnimationFrame(update);
      }, SETTLE_DELAY_MS);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });

    return () => {
      root.classList.remove("documentCanvasAtFooter");
      root.style.setProperty("--document-canvas-color", paper);
      root.style.backgroundColor = paper;
      body.style.backgroundColor = paper;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, []);

  return null;
}
