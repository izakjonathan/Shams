"use client";

import { useEffect } from "react";
import { visualViewportHeight } from "../lib/viewport";

const REVEAL_GROUPS: Array<{ root: string; items: string }> = [
  // The hero and About section form the initial editorial composition and must
  // always paint in their final state. Concealing either after hydration caused
  // visible blinking and large temporary gaps on iOS Safari.
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
 * Adds progressive reveal motion only to content that is safely below the
 * initial viewport. Near-viewport content never receives a hidden state, so
 * hydration cannot produce visible -> hidden -> visible blinking.
 */
export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const animatedItems: HTMLElement[] = [];
    let routeTarget = "";

    try {
      routeTarget = sessionStorage.getItem("shf-route-target") ?? "";
      sessionStorage.removeItem("shf-route-target");
    } catch {}

    const suppressLineupMotion = routeTarget.startsWith("#artist-");
    // Keep approximately the first two visual viewports completely static.
    // This includes the full hero/About handoff on phones with dynamic chrome.
    const staticPaintLimit = visualViewportHeight() * 2;

    REVEAL_GROUPS.forEach(({ root: rootSelector, items }) => {
      const groupRoot = document.querySelector<HTMLElement>(rootSelector);
      if (!groupRoot) return;

      Array.from(groupRoot.querySelectorAll<HTMLElement>(items)).forEach((item, index) => {
        const shouldStayStatic =
          item.getBoundingClientRect().top <= staticPaintLimit ||
          (suppressLineupMotion && rootSelector === "#lineup");

        if (shouldStayStatic) return;

        item.classList.add("revealItem");
        item.style.setProperty("--reveal-order", String(index % 4));
        animatedItems.push(item);
      });
    });

    if (!animatedItems.length) return;

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
          item.style.willChange = "opacity, transform";
          item.addEventListener("transitionend", clearWillChange as EventListener);
          item.classList.add("isRevealed");
        });
      },
      { threshold: 0, rootMargin: "0px 0px -9% 0px" }
    );

    const frame = window.requestAnimationFrame(() => {
      animatedItems.forEach((item) => observer.observe(item));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      root.classList.remove("scrollRevealEnabled");
      animatedItems.forEach((item) => {
        item.removeEventListener("transitionend", clearWillChange as EventListener);
        item.classList.remove("revealItem", "isRevealed");
        item.style.removeProperty("--reveal-order");
        item.style.removeProperty("will-change");
      });
    };
  }, []);

  return null;
}
