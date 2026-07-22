"use client";

import { useEffect } from "react";

const EDGE_TOLERANCE = 4;

/**
 * Safari only needs an explicit document-canvas override at the bottom.
 * The top always uses the normal paper root color. Keeping the controller
 * one-directional avoids menu/viewport races that previously polluted the top.
 */
export function OverscrollBackdrop() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let frame = 0;

    const applyBottomState = () => {
      frame = 0;
      const scrollTop = Math.max(0, window.scrollY, root.scrollTop, body.scrollTop);
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const documentHeight = Math.max(root.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(0, documentHeight - viewportHeight);
      const atBottom = maxScroll > EDGE_TOLERANCE && scrollTop >= maxScroll - EDGE_TOLERANCE;

      root.classList.toggle("overscrollBottom", atBottom);
      body.classList.toggle("overscrollBottom", atBottom);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(applyBottomState);
    };

    applyBottomState();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      root.classList.remove("overscrollBottom");
      body.classList.remove("overscrollBottom");
    };
  }, []);

  return null;
}
