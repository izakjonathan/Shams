"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSafariUiColor } from "./SafariUiColorProvider";

const ENTER_DURATION_MS = 760;
const MIN_HOLD_MS = 1800;
const EXIT_DURATION_MS = 1150;

type SplashStage = "entering" | "active" | "exiting" | "done";

/**
 * Full-screen splash sequence:
 * 1. artwork fades/scales/deblurs into place,
 * 2. remains fully visible for a deliberate hold,
 * 3. fades and gently expands away while the site enters underneath.
 */
export function SplashScreen() {
  const { setSplashActive } = useSafariUiColor();
  const [stage, setStage] = useState<SplashStage>("entering");
  const hasBegunExit = useRef(false);

  useEffect(() => {
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let hasLoaded = document.readyState === "complete";
    let enterFrame = 0;
    let exitTimer = 0;
    let doneTimer = 0;

    body.classList.add("splashActive");
    body.classList.remove("splashExiting", "splashComplete");
    setSplashActive(true);

    // Two frames ensure the entering state is painted before transitioning in.
    if (reducedMotion) {
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
        setSplashActive(false);
      }, reducedMotion ? 50 : EXIT_DURATION_MS);
    };

    const maybeScheduleExit = () => {
      if (!hasLoaded || hasBegunExit.current) return;
      const minimumTotal = reducedMotion ? 1000 : ENTER_DURATION_MS + MIN_HOLD_MS;
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
      body.classList.remove("splashActive", "splashExiting", "splashComplete");
      setSplashActive(false);
    };
  }, [setSplashActive]);

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
