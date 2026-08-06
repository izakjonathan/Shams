"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "../lib/motion";

const SELECTOR = "[data-lower-reveal]";
const INITIAL_VIEWPORT_BUFFER = 0.08;
const STAGGER_STEP_MS = 45;
const MAX_STAGGER_ITEMS = 5;

function viewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Progressive enhancement for lower-page content.
 *
 * Server HTML remains visible by default. During the pre-paint layout phase,
 * only marked elements clearly below the initial visual viewport are placed in
 * a pending state. Hero and About have no reveal markers and can never be
 * concealed. This keeps first paint deterministic while allowing the effect on
 * iOS Safari and other modern browsers.
 */
export function LowerSectionReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") return;

    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (elements.length === 0) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      for (const element of elements) element.classList.add("isLowerRevealVisible");
      return;
    }

    const initialLimit = viewportHeight() * (1 + INITIAL_VIEWPORT_BUFFER);
    const pending: HTMLElement[] = [];

    for (const [index, element] of elements.entries()) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= initialLimit) {
        element.classList.add("isLowerRevealVisible");
        continue;
      }

      element.style.setProperty(
        "--lower-reveal-delay",
        `${(index % MAX_STAGGER_ITEMS) * STAGGER_STEP_MS}ms`,
      );
      element.classList.add("isLowerRevealPending");
      pending.push(element);
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
        threshold: 0.04,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    for (const element of pending) observer.observe(element);

    return () => {
      observer.disconnect();
      root.classList.remove("lowerRevealEnabled");
      for (const element of elements) {
        element.classList.remove("isLowerRevealPending", "isLowerRevealVisible");
        element.style.removeProperty("--lower-reveal-delay");
      }
    };
  }, [pathname]);

  return null;
}
