"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const FADE_DURATION_MS = 220;
const NAVIGATION_WATCHDOG_MS = 3000;
type FadePhase = "visible" | "exiting" | "entering";

interface NavigateOptions {
  readonly replace?: boolean;
  readonly focusDestination?: boolean;
}

interface RouteTransitionContextValue {
  readonly navigate: (href: string, options?: NavigateOptions) => void;
  readonly transitioning: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) throw new Error("useRouteTransition must be used inside RouteFade");
  return context;
}

function decodeHash(hash: string | null) {
  if (!hash) return null;
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return hash.replace(/^#/, "");
  }
}

export function RouteFade({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const routeKey = pathname;
  const [phase, setPhase] = useState<FadePhase>("visible");
  const phaseRef = useRef<FadePhase>("visible");
  const navigationTimerRef = useRef<number | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const framesRef = useRef<number[]>([]);
  const previousRouteRef = useRef(routeKey);
  const pendingTargetRef = useRef<{ hash: string | null; focus: boolean } | null>(null);

  const clearAsyncWork = useCallback(() => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
    if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
    navigationTimerRef.current = null;
    watchdogRef.current = null;
    framesRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
    framesRef.current = [];
  }, []);

  const setTransitionPhase = useCallback((next: FadePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const positionAndFocusDestination = useCallback((hash: string | null, shouldFocus: boolean) => {
    const targetId = decodeHash(hash);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      if (target.closest("#lineup")) {
        document.querySelectorAll<HTMLElement>("#lineup .revealItem").forEach((item) => {
          item.classList.add("isRevealed");
          item.style.willChange = "auto";
        });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    if (shouldFocus) {
      const focusTarget = target ?? document.querySelector<HTMLElement>("main#main-content");
      if (focusTarget) {
        const hadTabIndex = focusTarget.hasAttribute("tabindex");
        if (!hadTabIndex) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
        if (!hadTabIndex) {
          focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
        }
      }
    }
  }, []);

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    if (phaseRef.current !== "visible") return;

    const destination = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    const sameDocument = destination.pathname === current.pathname && destination.search === current.search;

    if (sameDocument) {
      if (destination.hash) {
        const target = document.getElementById(decodeHash(destination.hash) ?? "");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(window.history.state, "", destination.hash);
        if (options?.focusDestination && target) {
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
      }
      return;
    }

    clearAsyncWork();
    pendingTargetRef.current = {
      hash: destination.hash || null,
      focus: Boolean(options?.focusDestination),
    };
    setTransitionPhase("exiting");

    watchdogRef.current = window.setTimeout(() => {
      pendingTargetRef.current = null;
      setTransitionPhase("visible");
    }, NAVIGATION_WATCHDOG_MS);

    navigationTimerRef.current = window.setTimeout(() => {
      const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
      try {
        if (options?.replace) router.replace(nextHref, { scroll: false });
        else router.push(nextHref, { scroll: false });
      } catch {
        pendingTargetRef.current = null;
        setTransitionPhase("visible");
      }
    }, FADE_DURATION_MS);
  }, [clearAsyncWork, router, setTransitionPhase]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handlePopState = () => {
      pendingTargetRef.current = { hash: window.location.hash || null, focus: false };
      setTransitionPhase("entering");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.scrollRestoration = previous;
    };
  }, [setTransitionPhase]);

  useLayoutEffect(() => {
    if (previousRouteRef.current === routeKey) return;
    previousRouteRef.current = routeKey;

    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
    if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
    navigationTimerRef.current = null;
    watchdogRef.current = null;
    setTransitionPhase("entering");

    const firstFrame = window.requestAnimationFrame(() => {
      const pending = pendingTargetRef.current ?? {
        hash: window.location.hash || null,
        focus: false,
      };
      positionAndFocusDestination(pending.hash, pending.focus);
      pendingTargetRef.current = null;

      const secondFrame = window.requestAnimationFrame(() => setTransitionPhase("visible"));
      framesRef.current.push(secondFrame);
    });
    framesRef.current.push(firstFrame);

    return () => {
      framesRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
      framesRef.current = [];
    };
  }, [positionAndFocusDestination, routeKey, setTransitionPhase]);

  useEffect(() => clearAsyncWork, [clearAsyncWork]);

  const context = useMemo<RouteTransitionContextValue>(() => ({
    navigate,
    transitioning: phase !== "visible",
  }), [navigate, phase]);

  return (
    <RouteTransitionContext.Provider value={context}>
      <div
        className={`routeFade is-${phase}`}
        aria-busy={phase !== "visible"}
        data-route-transition={phase}
      >
        <span className="routeTransitionStatus" aria-live="polite">
          {phase === "visible" ? "" : "Loading page"}
        </span>
        {children}
      </div>
    </RouteTransitionContext.Provider>
  );
}
