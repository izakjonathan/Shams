"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { afterPaint, cssTimeMs, prefersReducedMotion } from "../../../lib/motion";
import splashArtwork from "../../../../public/images/splash-humanity-artwork.png";

const MIN_HOLD_MS = 640;
const FONT_READY_TIMEOUT_MS = 800;
const MAX_SPLASH_WAIT_MS = 2000;
const SESSION_KEY = "shf-splash-seen-v2.6.0";
let hasShownSplashInMemory = false;

function hasSeenSplashThisSession(): boolean {
  if (hasShownSplashInMemory) return true;
  try { return window.sessionStorage.getItem(SESSION_KEY) === "1"; }
  catch { return false; }
}

function markSplashSeen(): void {
  hasShownSplashInMemory = true;
  try { window.sessionStorage.setItem(SESSION_KEY, "1"); }
  catch { /* In-memory state still prevents repeats during navigation. */ }
}

type SplashStage = "entering" | "active" | "exiting" | "done";

/** A bounded artwork dissolve; never waits on unrelated page images or window.load. */
export function SplashScreen() {
  const [stage, setStage] = useState<SplashStage>("entering");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const shell = document.querySelector<HTMLElement>(".siteShell");
    const image = imageRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enterDuration = cssTimeMs("--duration-splash-enter", 320);
    const exitDuration = cssTimeMs("--duration-splash-exit", 420);
    const start = performance.now();
    let cancelled = false;
    let finished = false;
    let exiting = false;
    let cancelEnterPaint: (() => void) | undefined = undefined;
    let cancelHandoffPaint: (() => void) | undefined;
    let exitTimer = 0;
    let doneTimer = 0;
    let fontTimer = 0;
    let watchdog = 0;

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
      root.style.setProperty("--document-canvas-color", "#000000");
      body.style.removeProperty("--document-canvas-color");
      setShellInert(false);
    };
    const complete = () => {
      if (cancelled || finished) return;
      finished = true;
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(fontTimer);
      window.clearTimeout(watchdog);
      cancelEnterPaint?.();
      cancelHandoffPaint?.();
      setStage("done");
      markSplashSeen();
      root.classList.add("splashSessionSeen");
      restoreNormalDocument();
    };
    const handleMotionChange = () => { if (motionQuery.matches) complete(); };

    if (hasSeenSplashThisSession() || prefersReducedMotion()) {
      complete();
      return;
    }

    setShellInert(true);
    body.classList.add("splashActive");
    body.classList.remove("splashHandoff", "splashExiting", "splashComplete");
    root.classList.add("splashCanvasActive");
    cancelEnterPaint = afterPaint(() => { if (!cancelled) setStage("active"); });
    motionQuery.addEventListener("change", handleMotionChange);

    const waitForDisplayFont = async () => {
      if (!("fonts" in document)) return;
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise<void>((resolve) => { fontTimer = window.setTimeout(resolve, FONT_READY_TIMEOUT_MS); }),
        ]);
      } catch { /* A failed font must not block the page. */ }
      window.clearTimeout(fontTimer);
    };
    const beginExit = async () => {
      if (cancelled || finished || exiting) return;
      exiting = true;
      await waitForDisplayFont();
      if (cancelled || finished || motionQuery.matches) return;
      body.classList.remove("splashActive");
      body.classList.add("splashHandoff");
      root.classList.add("splashCanvasHandoff");
      root.style.setProperty("--document-canvas-color", "#000000");
      setShellInert(false);
      cancelHandoffPaint = afterPaint(() => {
        if (cancelled) return;
        setStage("exiting");
        body.classList.remove("splashHandoff");
        body.classList.add("splashExiting");
        doneTimer = window.setTimeout(complete, exitDuration + 50);
      });
    };
    const scheduleExit = () => {
      if (cancelled || finished) return;
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(beginExit, Math.max(0, Math.max(enterDuration, MIN_HOLD_MS) - (performance.now() - start)));
    };
    image?.addEventListener("load", scheduleExit, { once: true });
    image?.addEventListener("error", scheduleExit, { once: true });
    if (!image || image.complete) scheduleExit();
    watchdog = window.setTimeout(beginExit, MAX_SPLASH_WAIT_MS);

    return () => {
      cancelled = true;
      cancelEnterPaint?.();
      cancelHandoffPaint?.();
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(fontTimer);
      window.clearTimeout(watchdog);
      image?.removeEventListener("load", scheduleExit);
      image?.removeEventListener("error", scheduleExit);
      motionQuery.removeEventListener("change", handleMotionChange);
      restoreNormalDocument();
    };
  }, []);

  if (stage === "done") return null;
  return (
    <div className={`splashScreen is${stage[0].toUpperCase()}${stage.slice(1)}`} aria-hidden="true">
      <div className="splashScreenArtWrap">
        <Image ref={imageRef} src={splashArtwork} alt="" fill priority sizes="100vw" className="splashScreenArt" />
      </div>
    </div>
  );
}
