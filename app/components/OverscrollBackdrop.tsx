"use client";

import { useEffect } from "react";

const EDGE_TOLERANCE = 3;

/**
 * Keeps Safari's rubber-band under-page background matched to the nearest
 * document edge. Menu scroll locking is ignored because iOS temporarily
 * reports collapsed/invalid page measurements while a fixed overlay is open.
 */
export function OverscrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;

    const clearBottomState = () => {
      root.classList.remove("overscrollBottom");
      body.classList.remove("overscrollBottom");
    };

    const applyEdgeState = () => {
      frame = 0;

      const menuLocked = root.classList.contains("menuScrollLocked");
      const scrollTop = Math.max(0, window.scrollY, root.scrollTop, body.scrollTop);

      if (menuLocked) {
        // Never allow the temporary locked viewport to turn the root canvas
        // black. Preserve a top canvas only when the real page is at the top.
        const useTop = scrollTop <= EDGE_TOLERANCE;
        root.classList.toggle("overscrollTop", useTop);
        body.classList.toggle("overscrollTop", useTop);
        clearBottomState();
        return;
      }

      const viewportHeight = Math.max(
        window.innerHeight,
        root.clientHeight,
        window.visualViewport?.height ?? 0,
      );
      const documentHeight = Math.max(
        root.scrollHeight,
        body.scrollHeight,
        root.offsetHeight,
        body.offsetHeight,
      );
      const maxScroll = Math.max(0, documentHeight - viewportHeight);
      const atTop = scrollTop <= EDGE_TOLERANCE;
      const hasScrollablePage = maxScroll > EDGE_TOLERANCE;
      const atBottom = hasScrollablePage && scrollTop >= maxScroll - EDGE_TOLERANCE;

      // Top wins if Safari briefly reports contradictory metrics.
      const useTop = atTop;
      const useBottom = !atTop && atBottom;

      root.classList.toggle("overscrollTop", useTop);
      body.classList.toggle("overscrollTop", useTop);
      root.classList.toggle("overscrollBottom", useBottom);
      body.classList.toggle("overscrollBottom", useBottom);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(applyEdgeState);
    };

    const refreshAfterLayout = () => {
      scheduleUpdate();
      window.requestAnimationFrame(() => window.requestAnimationFrame(scheduleUpdate));
    };

    applyEdgeState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("orientationchange", refreshAfterLayout, { passive: true });
    window.addEventListener("shams:viewport-state-change", refreshAfterLayout);
    window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", refreshAfterLayout);
      window.removeEventListener("shams:viewport-state-change", refreshAfterLayout);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("scroll", scheduleUpdate);
      root.classList.remove("overscrollTop", "overscrollBottom");
      body.classList.remove("overscrollTop", "overscrollBottom");
    };
  }, []);

  return null;
}
