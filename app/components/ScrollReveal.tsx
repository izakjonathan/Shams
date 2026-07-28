"use client";

import { useEffect, useLayoutEffect } from "react";

// This component only ever does anything in the browser (it queries the
// DOM and sets up an IntersectionObserver), so on the server it can safely
// fall back to useEffect, which avoids React's "useLayoutEffect does
// nothing on the server" warning during server rendering.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REVEAL_GROUPS: Array<{ root: string; items: string }> = [
  { root: "#about", items: ".sectionIndex, .statementGrid > h2, .statementGrid > div > *" },
  { root: "#mission", items: ".verticalText, .kicker, h2, .manifestoTags > span" },
  { root: "#lineup", items: ".sectionHeading .sectionIndex, .sectionHeading h2, .sectionHeading > p, .artistRow, .lineupNote" },
  { root: "#info", items: ".infoIntro > *, .infoCards > article" },
  { root: ".programme", items: ".sectionHeading .sectionIndex, .sectionHeading h2, .sectionHeading > p, .programmeFilters, .programmeEntry" },
  { root: "#tickets", items: ".ticketsHeader > *, h2, .ticketIntro > *, .ticketGrid > article, .ticketFooter > *" },
  { root: ".faq", items: ".sectionHeading .sectionIndex, .sectionHeading h2, .faqList > article" },
  { root: ".newsletter", items: ".kicker, h2, form > *" },
  { root: "footer", items: ".footerLogo, .footerLinks > div, .footerBottom > *" },
];

/**
 * Renders nothing — attaches the scroll-reveal IntersectionObserver to
 * content across the whole page after mount. Kept as its own client
 * component so the rest of the page can stay server-rendered.
 */
export function ScrollReveal() {
  useIsomorphicLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const revealItems: HTMLElement[] = [];

    REVEAL_GROUPS.forEach(({ root: rootSelector, items }) => {
      const groupRoot = document.querySelector<HTMLElement>(rootSelector);
      if (!groupRoot) return;

      Array.from(groupRoot.querySelectorAll<HTMLElement>(items)).forEach((item, index) => {
        item.classList.add("revealItem");
        item.style.setProperty("--reveal-order", String(index % 4));
        revealItems.push(item);
      });
    });

    const resetRevealItems = () => {
      root.classList.remove("scrollRevealEnabled");
      revealItems.forEach((item) => {
        item.classList.remove("revealItem", "isRevealed");
        item.style.removeProperty("--reveal-order");
        item.style.removeProperty("will-change");
      });
    };

    if (!revealItems.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("isRevealed"));
      return resetRevealItems;
    }

    root.classList.add("scrollRevealEnabled");

    const clearWillChange = (event: TransitionEvent) => {
      if (event.propertyName !== "opacity") return;
      const item = event.currentTarget as HTMLElement;
      item.style.willChange = "auto";
      item.removeEventListener("transitionend", clearWillChange as EventListener);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target as HTMLElement;
          observer.unobserve(item);
          // Promote only while this item is actually transitioning, then drop
          // the layer again — pinning every item on the page at once (before
          // it's even in view) was costing a lot of compositor overhead.
          item.style.willChange = "opacity, transform";
          item.addEventListener("transitionend", clearWillChange as EventListener);
          item.classList.add("isRevealed");
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -9% 0px",
      }
    );

    // Let the concealed state settle for one frame, then observe each content item.
    const frame = window.requestAnimationFrame(() => {
      revealItems.forEach((item) => observer.observe(item));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      revealItems.forEach((item) => {
        item.removeEventListener("transitionend", clearWillChange as EventListener);
      });
      resetRevealItems();
    };
  }, []);

  return null;
}
