"use client";

import { useEffect } from "react";
import { useSafariUiColor } from "./SafariUiColorProvider";

const EDGE_TOLERANCE = 4;

/** Reports the real bottom boundary to the single Safari UI color controller. */
export function OverscrollBackdrop() {
  const { menuActive, setAtBottom } = useSafariUiColor();

  useEffect(() => {
    let frame = 0;

    const applyBottomState = () => {
      frame = 0;
      if (menuActive) {
        setAtBottom(false);
        return;
      }

      const root = document.documentElement;
      const body = document.body;
      const scrollTop = Math.max(0, window.scrollY, root.scrollTop, body.scrollTop);
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const documentHeight = Math.max(root.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(0, documentHeight - viewportHeight);
      const atBottom = maxScroll > EDGE_TOLERANCE && scrollTop >= maxScroll - EDGE_TOLERANCE;

      setAtBottom(atBottom);
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
      setAtBottom(false);
    };
  }, [menuActive, setAtBottom]);

  return null;
}
