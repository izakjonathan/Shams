"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "../../../lib/motion";

const SELECTOR = "[data-lower-reveal]";
const INITIAL_VISIBLE_VIEWPORT_RATIO = 1;
const STAGGER_STEP_MS = 40;
const MAX_STAGGER_MS = 80;

/** Visible server HTML; arm only below-screen elements, and reveal each once. */
export function LowerSectionReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!elements.length) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const reveal = (element: HTMLElement, delay = 0) => {
      element.style.setProperty("--lower-reveal-delay", `${delay}ms`);
      element.classList.remove("isLowerRevealPending");
      element.classList.add("isLowerRevealVisible");
      observer?.unobserve(element);
    };

    const revealAll = () => {
      observer?.disconnect();
      root.classList.remove("lowerRevealEnabled");
      for (const element of elements) reveal(element);
    };

    const handleMotionChange = () => {
      if (motionQuery.matches) revealAll();
    };
    // Tab navigation must never land on transparent controls or text.
    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (let element = event.target.closest<HTMLElement>(SELECTOR); element;
        element = element.parentElement?.closest<HTMLElement>(SELECTOR) ?? null) {
        reveal(element);
      }
    };

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      revealAll();
    } else {
      const initialLimit = (window.visualViewport?.height ?? window.innerHeight) * INITIAL_VISIBLE_VIEWPORT_RATIO;
      // Batch all geometry reads before changing any styles.
      const positions = elements.map((element) => ({ element, top: element.getBoundingClientRect().top }));
      observer = new IntersectionObserver((entries) => {
        const arriving = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        for (const [index, entry] of arriving.entries()) {
          reveal(entry.target as HTMLElement, Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS));
        }
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

      for (const { element, top } of positions) {
        if (top <= initialLimit) reveal(element);
        else {
          element.classList.add("isLowerRevealPending");
          observer.observe(element);
        }
      }
      root.classList.add("lowerRevealEnabled");
      motionQuery.addEventListener("change", handleMotionChange);
      document.addEventListener("focusin", handleFocus);
    }

    return () => {
      observer?.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("focusin", handleFocus);
      root.classList.remove("lowerRevealEnabled");
      for (const element of elements) {
        element.classList.remove("isLowerRevealPending", "isLowerRevealVisible");
        element.style.removeProperty("--lower-reveal-delay");
      }
    };
  }, [pathname]);

  return null;
}
