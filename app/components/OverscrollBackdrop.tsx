"use client";

import { useEffect } from "react";

const EDGE_TOLERANCE = 3;

/**
 * Keeps Safari's rubber-band under-page background matched to the nearest
 * document edge: the hero treatment at the top and the footer black at bottom.
 */
export function OverscrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;

    const applyEdgeState = () => {
      frame = 0;
      const scrollTop = Math.max(0, window.scrollY || root.scrollTop || 0);
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const atTop = scrollTop <= EDGE_TOLERANCE;
      const atBottom = maxScroll - scrollTop <= EDGE_TOLERANCE;

      root.classList.toggle("overscrollTop", atTop && !atBottom);
      body.classList.toggle("overscrollTop", atTop && !atBottom);
      root.classList.toggle("overscrollBottom", atBottom && !atTop);
      body.classList.toggle("overscrollBottom", atBottom && !atTop);
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
    };
  }, []);

  return null;
}
