"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ENTER_DURATION_MS = 760;
const MIN_HOLD_MS = 1800;
const EXIT_DURATION_MS = 1150;
const REPEAT_HOLD_MS = 200;
const PAPER_COLOR = "#f5f2eb";
const CANVAS_COLOR = "#090909";
const SESSION_KEY = "shf-splash-seen";

function hasSeenSplashThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // Storage can throw in private-browsing modes; fall back to always
    // showing the full sequence rather than breaking the splash.
    return false;
  }
}

function markSplashSeen(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignore — non-fatal if the flag can't be persisted.
  }
}

type SplashStage = "entering" | "active" | "exiting" | "done";

/**
 * Full-screen splash sequence:
 * 1. artwork fades/scales/deblurs into place,
 * 2. remains fully visible for a deliberate hold,
 * 3. fades and gently expands away while the site enters underneath.
 */
export function SplashScreen() {
  const [stage, setStage] = useState<SplashStage>("entering");
  const hasBegunExit = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isRepeatVisit = hasSeenSplashThisSession();
    const skipEnterAnimation = reducedMotion || isRepeatVisit;
    const start = performance.now();
    let hasLoaded = document.readyState === "complete";
    let enterFrame = 0;
    let exitTimer = 0;
    let doneTimer = 0;

    markSplashSeen();

    body.classList.add("splashActive");
    body.classList.remove("splashExiting", "splashComplete");
    root.style.backgroundColor = PAPER_COLOR;
    body.style.backgroundColor = PAPER_COLOR;

    const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    themeColorMeta?.setAttribute("content", PAPER_COLOR);

    // Two frames ensure the entering state is painted before transitioning in.
    if (skipEnterAnimation) {
      setStage("active");
    } else {
      enterFrame = window.requestAnimationFrame(() => {
        enterFrame = window.requestAnimationFrame(() => setStage("active"));
      });
    }

    const beginExit = () => {
      if (hasBegunExit.current) return;
      hasBegunExit.current = true;
      setStage("exiting");
      body.classList.remove("splashActive");
      body.classList.add("splashExiting");

      doneTimer = window.setTimeout(() => {
        setStage("done");
        body.classList.remove("splashExiting");
        body.classList.add("splashComplete");
        root.style.backgroundColor = CANVAS_COLOR;
        body.style.backgroundColor = CANVAS_COLOR;
        themeColorMeta?.setAttribute("content", CANVAS_COLOR);
      }, skipEnterAnimation ? 50 : EXIT_DURATION_MS);
    };

    const maybeScheduleExit = () => {
      if (!hasLoaded || hasBegunExit.current) return;
      const minimumTotal = isRepeatVisit
        ? REPEAT_HOLD_MS
        : reducedMotion
          ? 1000
          : ENTER_DURATION_MS + MIN_HOLD_MS;
      const remaining = Math.max(0, minimumTotal - (performance.now() - start));
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(beginExit, remaining);
    };

    const handleLoad = () => {
      hasLoaded = true;
      maybeScheduleExit();
    };

    if (hasLoaded) {
      maybeScheduleExit();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      className={`splashScreen is${stage[0].toUpperCase()}${stage.slice(1)}`}
      aria-hidden="true"
    >
      <div className="splashScreenArtWrap">
        <Image
          src="/images/splash-screen-edge-safe.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="splashScreenArt"
        />
      </div>
    </div>
  );
}
