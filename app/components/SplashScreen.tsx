"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 1000;
const EXIT_DURATION_MS = 720;

/**
 * Full-screen splash overlay.
 * Pattern used: minimum dwell time -> wait for page load ->
 * fade/scale/soften splash out -> reveal site shell underneath.
 */
export function SplashScreen() {
  const [stage, setStage] = useState<"active" | "exiting" | "done">("active");
  const hasBegunExit = useRef(false);

  useEffect(() => {
    const body = document.body;
    const start = performance.now();
    let hasLoaded = document.readyState === "complete";
    let exitTimer = 0;
    let doneTimer = 0;

    body.classList.add("splashActive");
    body.classList.remove("splashExiting", "splashComplete");

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
      }, EXIT_DURATION_MS);
    };

    const maybeScheduleExit = () => {
      if (!hasLoaded || hasBegunExit.current) return;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
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
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("load", handleLoad);
      body.classList.remove("splashActive", "splashExiting", "splashComplete");
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      className={`splashScreen ${stage === "exiting" ? "isExiting" : ""}`.trim()}
      aria-hidden="true"
    >
      <div className="splashScreenArtWrap">
        <Image
          src="/images/splash-screen.png"
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
