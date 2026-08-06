"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "../lib/motion";

const SELECTOR = "[data-lower-reveal]";
const INITIAL_VIEWPORT_BUFFER = 0.35;

function isIOSWebKit(): boolean {
  const ua = navigator.userAgent;
  const iosDevice = /iP(?:hone|ad|od)/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const webKit = /AppleWebKit/i.test(ua);
  const alternateIOSBrowser = /(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
  return iosDevice && webKit && !alternateIOSBrowser;
}

function viewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Progressive enhancement for content safely below the initial viewport.
 *
 * The public page is fully visible in server HTML. Concealment is enabled only
 * after hydration, only for lower-page elements, and never on iOS WebKit or
 * when reduced motion is requested. This avoids the visible → hidden → visible
 * hydration regression that affected the previous reveal implementation.
 */
export function LowerSectionReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") return;

    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (elements.length === 0) return;

    const revealEverything = prefersReducedMotion() || isIOSWebKit() || !("IntersectionObserver" in window);
    if (revealEverything) {
      for (const element of elements) element.classList.add("isLowerRevealVisible");
      return;
    }

    const initialLimit = viewportHeight() * (1 + INITIAL_VIEWPORT_BUFFER);
    const pending: HTMLElement[] = [];

    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= initialLimit) {
        element.classList.add("isLowerRevealVisible");
      } else {
        element.classList.add("isLowerRevealPending");
        pending.push(element);
      }
    }

    if (pending.length === 0) return;

    root.classList.add("lowerRevealEnabled");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.classList.remove("isLowerRevealPending");
          element.classList.add("isLowerRevealVisible");
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    for (const element of pending) observer.observe(element);

    return () => {
      observer.disconnect();
      root.classList.remove("lowerRevealEnabled");
      for (const element of elements) {
        element.classList.remove("isLowerRevealPending", "isLowerRevealVisible");
      }
    };
  }, [pathname]);

  return null;
}
