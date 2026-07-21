"use client";

import { useEffect } from "react";

const EDGE_TOLERANCE = 3;
const TOP_THEME_COLOR = "#f6d98d";
const BOTTOM_THEME_COLOR = "#090909";
const DEFAULT_THEME_COLOR = "#f5f2eb";

/**
 * Keeps Safari's rubber-band under-page background matched to the nearest
 * document edge: the hero treatment at the top and the footer black at bottom.
 */
export function OverscrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let frame = 0;

    const applyEdgeState = () => {
      frame = 0;
      const scrollTop = Math.max(0, window.scrollY || root.scrollTop || 0);
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const atTop = scrollTop <= EDGE_TOLERANCE;
      const atBottom = maxScroll - scrollTop <= EDGE_TOLERANCE;

      const useTop = atTop && !atBottom;
      const useBottom = atBottom && !atTop;

      root.classList.toggle("overscrollTop", useTop);
      body.classList.toggle("overscrollTop", useTop);
      root.classList.toggle("overscrollBottom", useBottom);
      body.classList.toggle("overscrollBottom", useBottom);

      // Safari's status/address-bar tint is separate from the CSS under-page
      // canvas. Keep it synchronized with the nearest document edge.
      if (themeColor) {
        themeColor.content = useBottom
          ? BOTTOM_THEME_COLOR
          : useTop
            ? TOP_THEME_COLOR
            : DEFAULT_THEME_COLOR;
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(applyEdgeState);
    };

    applyEdgeState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("orientationchange", scheduleUpdate, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      root.classList.remove("overscrollTop", "overscrollBottom");
      body.classList.remove("overscrollTop", "overscrollBottom");
      if (themeColor) themeColor.content = TOP_THEME_COLOR;
    };
  }, []);

  return null;
}
