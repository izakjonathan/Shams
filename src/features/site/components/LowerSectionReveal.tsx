"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "../../../lib/motion";

const SELECTOR = "[data-lower-reveal]";
const STAGGER_STEP_MS = 40;
const MAX_STAGGER_MS = 80;

/** Progressive enhancement: SSR remains visible until an element is safely enrolled. */
export function LowerSectionReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let mutationObserver: MutationObserver | undefined;

    const reveal = (element: HTMLElement, delay = 0) => {
      element.style.setProperty("--lower-reveal-delay", `${delay}ms`);
      element.classList.remove("isLowerRevealPending");
      element.classList.add("isLowerRevealVisible");
      observer?.unobserve(element);
    };

    const revealAll = () => {
      observer?.disconnect();
      root.classList.remove("lowerRevealEnabled");
      for (const element of tracked) reveal(element);
    };

    const enroll = (element: HTMLElement) => {
      if (tracked.has(element)) return;
      tracked.add(element);
      if (motionQuery.matches || !observer || document.querySelector('.routeFade[data-route-phase]:not([data-route-phase="idle"])')) {
        reveal(element);
        return;
      }
      // Never conceal an element already on screen, including newly streamed
      // content, focused controls, or content arriving behind a route curtain.
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const rect = element.getBoundingClientRect();
      if (rect.top <= viewport || element.contains(document.activeElement)) reveal(element);
      else {
        element.classList.add("isLowerRevealPending");
        observer.observe(element);
      }
    };

    const handleMotionChange = () => { if (motionQuery.matches) revealAll(); };
    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (let element = event.target.closest<HTMLElement>(SELECTOR); element;
        element = element.parentElement?.closest<HTMLElement>(SELECTOR) ?? null) reveal(element);
    };

    if (!prefersReducedMotion() && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        const arriving = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        arriving.forEach((entry, index) => reveal(entry.target as HTMLElement, Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS)));
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    }

    // Scope observation to the content shell rather than observing the whole DOM.
    const container = document.querySelector<HTMLElement>(".routeFade") ?? document.querySelector<HTMLElement>("main");
    for (const element of document.querySelectorAll<HTMLElement>(SELECTOR)) enroll(element);
    if (observer) root.classList.add("lowerRevealEnabled");

    if (container && "MutationObserver" in window) {
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.matches(SELECTOR)) enroll(node);
            for (const element of node.querySelectorAll<HTMLElement>(SELECTOR)) enroll(element);
          }
        }
      });
      mutationObserver.observe(container, { childList: true, subtree: true });
    }
    motionQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("focusin", handleFocus);

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("focusin", handleFocus);
      root.classList.remove("lowerRevealEnabled");
      // Never leave concealed content after a route change or observer cleanup.
      for (const element of tracked) {
        element.classList.remove("isLowerRevealPending");
        element.classList.add("isLowerRevealVisible");
        element.style.removeProperty("--lower-reveal-delay");
      }
    };
  }, [pathname]);

  return null;
}
