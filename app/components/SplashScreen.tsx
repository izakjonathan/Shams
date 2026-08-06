"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { afterPaint, cssTimeMs, prefersReducedMotion } from "../lib/motion";
import splashArtwork from "../../public/images/splash-humanity-artwork.png";

const MIN_HOLD_MS = 1100;
const FONT_READY_TIMEOUT_MS = 1400;
const SESSION_KEY = "shf-splash-seen-v2.5.0";
let hasShownSplashInMemory = false;

function hasSeenSplashThisSession(): boolean {
  if (hasShownSplashInMemory) return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSplashSeen(): void {
  hasShownSplashInMemory = true;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // The in-memory fallback still prevents repeats during client navigation.
  }
}


type SplashStage = "entering" | "active" | "exiting" | "done";

/**
 * Full-screen splash sequence with no document-scroll mutation:
 * 1. keep an explicit sampled blue document colour,
 * 2. bleed the artwork beyond both toolbar edges,
 * 3. atomically prepare the live site and paper canvas,
 * 4. dissolve the artwork only after the destination is painted.
 */
export function SplashScreen() {
  const [stage, setStage] = useState<SplashStage>("entering");
  const hasBegunExit = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const shell = document.querySelector<HTMLElement>(".siteShell");
    const reducedMotion = prefersReducedMotion();
    const enterDuration = cssTimeMs("--duration-splash-enter", 760);
    const exitDuration = cssTimeMs("--duration-splash-exit", 860);
    const isRepeatVisit = hasSeenSplashThisSession();
    const skipEnterAnimation = reducedMotion;
    const start = performance.now();
    let hasLoaded = document.readyState === "complete";
    let cancelEnterPaint: (() => void) | null = null;
    let cancelHandoffPaint: (() => void) | null = null;
    let exitTimer = 0;
    let doneTimer = 0;
    let completed = false;

    const setShellInert = (inert: boolean) => {
      if (!shell) return;
      shell.inert = inert;
      if (inert) shell.setAttribute("aria-hidden", "true");
      else shell.removeAttribute("aria-hidden");
    };

    const restoreNormalDocument = () => {
      root.classList.remove("splashCanvasActive", "splashCanvasHandoff");
      body.classList.remove("splashActive", "splashHandoff", "splashExiting");
      body.classList.add("splashComplete");
      root.style.setProperty("--document-canvas-color", "var(--color-paper)");
      body.style.removeProperty("--document-canvas-color");
      setShellInert(false);
    };

    if (isRepeatVisit) {
      hasShownSplashInMemory = true;
      setStage("done");
      root.classList.add("splashSessionSeen");
      restoreNormalDocument();
      completed = true;
      return;
    }

    setShellInert(true);
    body.classList.add("splashActive");
    body.classList.remove("splashHandoff", "splashExiting", "splashComplete");
    root.classList.add("splashCanvasActive");
    if (skipEnterAnimation) {
      setStage("active");
    } else {
      cancelEnterPaint = afterPaint(() => setStage("active"));
    }

    const waitForDisplayFont = async () => {
      if (!("fonts" in document)) return;
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => window.setTimeout(resolve, FONT_READY_TIMEOUT_MS)),
      ]);
    };

    const beginExit = async () => {
      if (hasBegunExit.current) return;
      hasBegunExit.current = true;

      // Keep the artwork fully opaque until the display font has either loaded
      // or reached a bounded timeout. This prevents a Times-to-Agilera swap
      // from occurring after the hero is already visible.
      await waitForDisplayFont();

      // Prepare the live page while the splash is still fully opaque.
      body.classList.remove("splashActive");
      body.classList.add("splashHandoff");
      root.classList.add("splashCanvasHandoff");
      root.style.setProperty("--document-canvas-color", "var(--color-paper)");
      body.style.removeProperty("--document-canvas-color");
      setShellInert(false);

      cancelHandoffPaint = afterPaint(() => {
        setStage("exiting");
        body.classList.remove("splashHandoff");
        body.classList.add("splashExiting");
      });

      doneTimer = window.setTimeout(() => {
        setStage("done");
        markSplashSeen();
        root.classList.add("splashSessionSeen");
        restoreNormalDocument();
        completed = true;
        window.dispatchEvent(new Event("scroll"));
      }, skipEnterAnimation ? 50 : exitDuration + 50);
    };

    const maybeScheduleExit = () => {
      if (!hasLoaded || hasBegunExit.current) return;
      const minimumTotal = reducedMotion ? 0 : enterDuration + MIN_HOLD_MS;
      const remaining = Math.max(0, minimumTotal - (performance.now() - start));
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(beginExit, remaining);
    };

    const handleLoad = () => {
      hasLoaded = true;
      maybeScheduleExit();
    };

    if (hasLoaded) maybeScheduleExit();
    else window.addEventListener("load", handleLoad, { once: true });

    return () => {
      cancelEnterPaint?.();
      cancelHandoffPaint?.();
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", handleLoad);
      if (!completed) restoreNormalDocument();
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
          src={splashArtwork}
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
