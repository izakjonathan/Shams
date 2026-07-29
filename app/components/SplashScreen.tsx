"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import splashArtwork from "../../public/images/splash-humanity-artwork.jpeg";

const ENTER_DURATION_MS = 760;
const MIN_HOLD_MS = 1800;
const EXIT_DURATION_MS = 860;
const SESSION_KEY = "shf-splash-seen-v1.8.3";
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

function splashRunwayOffset(): number {
  const raw = window.getComputedStyle(document.documentElement)
    .getPropertyValue("--safari-splash-scroll-offset");
  return Number.parseFloat(raw) || 0;
}

function shouldUseSplashRunway(): boolean {
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const touch = navigator.maxTouchPoints > 0;
  const safari = /Safari/i.test(navigator.userAgent) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(navigator.userAgent);
  return mobile && touch && safari;
}

type SplashStage = "entering" | "active" | "exiting" | "done";

/**
 * Full-screen splash sequence with an iOS-Safari-only scroll runway:
 * 1. keep an explicit sampled blue document colour,
 * 2. scroll a small hidden runway so Safari can composite real pixels,
 * 3. bleed the artwork beyond both toolbar edges,
 * 4. atomically prepare the live site and paper canvas,
 * 5. dissolve the artwork only after the destination is painted.
 */
export function SplashScreen() {
  const [stage, setStage] = useState<SplashStage>("entering");
  const hasBegunExit = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const shell = document.querySelector<HTMLElement>(".siteShell");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isRepeatVisit = hasSeenSplashThisSession();
    const skipEnterAnimation = reducedMotion;
    const useRunway = shouldUseSplashRunway();
    const start = performance.now();
    let hasLoaded = document.readyState === "complete";
    let enterFrame = 0;
    let runwayFrame = 0;
    let handoffFrame = 0;
    let exitTimer = 0;
    let doneTimer = 0;

    const setShellInert = (inert: boolean) => {
      if (!shell) return;
      shell.inert = inert;
      if (inert) shell.setAttribute("aria-hidden", "true");
      else shell.removeAttribute("aria-hidden");
    };

    if (isRepeatVisit) {
      hasShownSplashInMemory = true;
      setStage("done");
      root.classList.add("splashSessionSeen");
      root.classList.remove("splashCanvasActive", "splashCanvasHandoff", "splashRunwayActive");
      body.classList.remove("splashActive", "splashHandoff", "splashExiting");
      body.classList.add("splashComplete");
      setShellInert(false);
      root.style.setProperty("--document-canvas-color", "var(--color-paper)");
      body.style.setProperty("--document-canvas-color", "var(--color-paper)");
      return;
    }

    setShellInert(true);
    body.classList.add("splashActive");
    body.classList.remove("splashHandoff", "splashExiting", "splashComplete");
    root.classList.add("splashCanvasActive");
    if (useRunway) {
      root.classList.add("splashRunwayActive");
      runwayFrame = window.requestAnimationFrame(() => {
        runwayFrame = window.requestAnimationFrame(() => {
          const offset = splashRunwayOffset();
          if (offset > 0 && window.scrollY < offset) {
            window.scrollTo({ top: offset, left: 0, behavior: "auto" });
          }
        });
      });
    } else {
      root.classList.remove("splashRunwayActive");
    }

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

      // Prepare the live page while the splash is still fully opaque.
      root.classList.remove("splashRunwayActive");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      body.classList.remove("splashActive");
      body.classList.add("splashHandoff");
      root.classList.add("splashCanvasHandoff");
      root.style.setProperty("--document-canvas-color", "var(--color-paper)");
      body.style.setProperty("--document-canvas-color", "var(--color-paper)");
      setShellInert(false);

      handoffFrame = window.requestAnimationFrame(() => {
        handoffFrame = window.requestAnimationFrame(() => {
          setStage("exiting");
          body.classList.remove("splashHandoff");
          body.classList.add("splashExiting");
        });
      });

      doneTimer = window.setTimeout(() => {
        setStage("done");
        body.classList.remove("splashHandoff", "splashExiting");
        body.classList.add("splashComplete");
        markSplashSeen();
        root.classList.add("splashSessionSeen");
        root.classList.remove("splashCanvasActive", "splashCanvasHandoff", "splashRunwayActive");
        window.dispatchEvent(new Event("scroll"));
      }, skipEnterAnimation ? 50 : EXIT_DURATION_MS + 34);
    };

    const maybeScheduleExit = () => {
      if (!hasLoaded || hasBegunExit.current) return;
      const minimumTotal = reducedMotion ? 0 : ENTER_DURATION_MS + MIN_HOLD_MS;
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
      window.cancelAnimationFrame(enterFrame);
      window.cancelAnimationFrame(runwayFrame);
      window.cancelAnimationFrame(handoffFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", handleLoad);
      setShellInert(false);
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
