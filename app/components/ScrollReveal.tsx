"use client";

import { useLayoutEffect } from "react";

const REVEAL_GROUPS: Array<{ root: string; items: string }> = [
  { root: "#about", items: ".sectionIndex, .statementGrid > h2, .statementGrid > div > *" },
  { root: "#mission", items: ".verticalText, .kicker, h2, .manifestoTags > span" },
  { root: "#lineup", items: ".sectionHeading .sectionIndex, .sectionHeading h2, .sectionHeading > p, .artistRow, .lineupNote" },
  { root: "#info", items: ".infoIntro > *, .infoCards > article" },
  { root: ".programme", items: ".sectionHeading .sectionIndex, .sectionHeading h2, .sectionHeading > p, .timeline > div" },
  { root: "#tickets", items: ".ticketsHeader > *, h2, .ticketGrid > article, .ticketFootnote" },
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
  useLayoutEffect(() => {
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

    if (!revealItems.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("isRevealed"));
      return;
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
      root.classList.remove("scrollRevealEnabled");
      revealItems.forEach((item) => {
        item.classList.remove("revealItem", "isRevealed");
        item.style.removeProperty("--reveal-order");
        item.style.removeProperty("will-change");
        item.removeEventListener("transitionend", clearWillChange as EventListener);
      });
    };
  }, []);

  return null;
}
