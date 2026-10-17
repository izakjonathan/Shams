"use client";

import { useEffect, type RefObject } from "react";

const SURFACES = ".openingSections, .darkGlowSection, .eventGallery, .paperGlowSection:not(.openingSections), .eventInfo, .newsletter, .siteFooter, .informationPage, .contactPage, .artistEditorial, .artistLinks, .artistNavigation";

/** Observe the strip behind the header, rather than sampling colours on scroll. */
export function useHeaderTone(
  headerRef: RefObject<HTMLElement | null>,
  pathname: string,
  transitioning: boolean,
) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header || transitioning) return;
    const surfaces = [...document.querySelectorAll<HTMLElement>(SURFACES)];
    if (!surfaces.length || !("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;

    const updateTone = () => {
      const line = header.offsetHeight / 2;
      // Nested surfaces take priority over their page container.
      const surface = surfaces.findLast((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      header.dataset.tone = surface?.matches(".eventGallery") ? "photo"
        : surface?.matches(".darkGlowSection, .siteFooter, .artistLinks, .artistNavigation") ? "dark"
        : "light";
    };
    const observe = () => {
      observer?.disconnect();
      const line = Math.min(header.offsetHeight / 2, window.innerHeight - 1);
      observer = new IntersectionObserver(updateTone, {
        rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`,
        threshold: 0,
      });
      for (const surface of surfaces) observer.observe(surface);
      updateTone();
    };
    observe();
    window.addEventListener("resize", observe, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [headerRef, pathname, transitioning]);
}
