"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const FALLBACK_EXIT_MS = 330;
const FALLBACK_ENTER_MS = 450;
const NAVIGATION_WATCHDOG_MS = 3500;

type TransitionPhase = "visible" | "exiting" | "entering";
type TransitionKind = "artist-open" | "artist-close" | "artist-switch" | "page-open" | "page-close" | "page-switch";
type TransitionEngine = "native" | "fallback";

interface NavigateOptions {
  readonly replace?: boolean;
  readonly focusOnArrival?: boolean;
  readonly transitionKind?: TransitionKind;
}

interface RouteTransitionContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
  transitioning: boolean;
}

interface ViewTransitionLike {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void | Promise<void>) => ViewTransitionLike;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) throw new Error("useRouteTransition must be used inside RouteFade");
  return context;
}

function routeFamily(pathname: string) {
  if (pathname.startsWith("/artists/")) return "artist";
  if (pathname === "/") return "home";
  return "page";
}

function inferTransitionKind(currentPath: string, destinationPath: string): TransitionKind {
  const currentFamily = routeFamily(currentPath);
  const destinationFamily = routeFamily(destinationPath);

  if (currentFamily === "home" && destinationFamily === "artist") return "artist-open";
  if (currentFamily === "artist" && destinationFamily === "home") return "artist-close";
  if (currentFamily === "artist" && destinationFamily === "artist") return "artist-switch";
  if (currentFamily === "home" && destinationFamily === "page") return "page-open";
  if (currentFamily === "page" && destinationFamily === "home") return "page-close";
  return "page-switch";
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RouteFade({ children, header }: { readonly children: ReactNode; readonly header?: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("visible");
  const [transitioning, setTransitioning] = useState(false);
  const phaseRef = useRef<TransitionPhase>("visible");
  const engineRef = useRef<TransitionEngine | null>(null);
  const transitionKindRef = useRef<TransitionKind>("page-switch");
  const navigationTimerRef = useRef<number | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const framesRef = useRef<number[]>([]);
  const routeRef = useRef("");
  const routeCommitResolverRef = useRef<(() => void) | null>(null);
  const activeViewTransitionRef = useRef<ViewTransitionLike | null>(null);
  const pendingTargetRef = useRef<{
    hash: string | null;
    focusOnArrival: boolean;
    sourcePath: string;
  } | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const clearTimersAndFrames = useCallback(() => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
    if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
    navigationTimerRef.current = null;
    watchdogRef.current = null;
    framesRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
    framesRef.current = [];
  }, []);

  const updatePhase = useCallback((next: TransitionPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const resetDocumentTransitionState = useCallback(() => {
    delete document.documentElement.dataset.routeTransition;
    delete document.documentElement.dataset.routeTransitionEngine;
    document.documentElement.classList.remove("routeTransitionActive");
  }, []);

  const positionDestination = useCallback(() => {
    const pending = pendingTargetRef.current;
    const hash = pending?.hash ?? (window.location.hash || null);
    let target: HTMLElement | null = null;

    if (hash && hash !== "#top") {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
      target?.scrollIntoView({ behavior: "auto", block: "start" });

      if (hash.startsWith("#artist-")) {
        document.querySelectorAll<HTMLElement>("#lineup .revealItem").forEach((item) => {
          item.classList.add("isRevealed");
          item.style.willChange = "auto";
        });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    return { target, focusOnArrival: Boolean(pending?.focusOnArrival) };
  }, []);

  const focusDestination = useCallback((target: HTMLElement | null, shouldFocus: boolean) => {
    if (!shouldFocus) return;
    const focusTarget = target ?? document.querySelector<HTMLElement>("main#main-content");
    focusTarget?.focus({ preventScroll: true });
  }, []);

  const finishTransition = useCallback(() => {
    setTransitioning(false);
    pendingTargetRef.current = null;
    routeCommitResolverRef.current = null;
    activeViewTransitionRef.current = null;
    engineRef.current = null;
    clearTimersAndFrames();
    updatePhase("visible");
    resetDocumentTransitionState();
    try { sessionStorage.removeItem("shf-route-target"); } catch {}
  }, [clearTimersAndFrames, resetDocumentTransitionState, updatePhase]);

  const recoverTransition = useCallback(() => {
    activeViewTransitionRef.current?.skipTransition();
    finishTransition();
  }, [finishTransition]);

  const performRouterNavigation = useCallback((href: string, replace?: boolean) => {
    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  }, [router]);

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    if (phaseRef.current !== "visible" || activeViewTransitionRef.current) return;

    const destination = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    const sameDocument = destination.pathname === current.pathname && destination.search === current.search;

    if (sameDocument) {
      if (destination.hash) {
        const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
        target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        window.history.pushState(window.history.state, "", destination.hash);
        if (options?.focusOnArrival) target?.focus({ preventScroll: true });
      }
      return;
    }

    clearTimersAndFrames();
    const transitionKind = options?.transitionKind ?? inferTransitionKind(current.pathname, destination.pathname);
    transitionKindRef.current = transitionKind;
    pendingTargetRef.current = {
      hash: destination.hash || null,
      focusOnArrival: Boolean(options?.focusOnArrival),
      sourcePath: current.pathname,
    };

    try { sessionStorage.setItem("shf-route-target", destination.hash || "#top"); } catch {}

    const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
    const nativeTransition = (document as ViewTransitionDocument).startViewTransition;
    const canUseNative = Boolean(nativeTransition) && !prefersReducedMotion();

    setTransitioning(true);
    document.documentElement.dataset.routeTransition = transitionKind;
    document.documentElement.dataset.routeTransitionEngine = canUseNative ? "native" : "fallback";
    document.documentElement.classList.add("routeTransitionActive");

    watchdogRef.current = window.setTimeout(recoverTransition, NAVIGATION_WATCHDOG_MS);

    if (canUseNative && nativeTransition) {
      engineRef.current = "native";
      const routeCommitted = new Promise<void>((resolve) => {
        routeCommitResolverRef.current = resolve;
      });

      const transition = nativeTransition.call(document, async () => {
        performRouterNavigation(nextHref, options?.replace);
        await routeCommitted;
      });

      activeViewTransitionRef.current = transition;
      transition.finished
        .then(() => {
          const { target, focusOnArrival } = positionDestination();
          focusDestination(target, focusOnArrival);
        })
        .catch(() => {})
        .finally(finishTransition);
      return;
    }

    engineRef.current = "fallback";
    updatePhase("exiting");
    navigationTimerRef.current = window.setTimeout(() => {
      performRouterNavigation(nextHref, options?.replace);
    }, FALLBACK_EXIT_MS);
  }, [clearTimersAndFrames, finishTransition, focusDestination, performRouterNavigation, positionDestination, recoverTransition, updatePhase]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handlePopState = () => {
      clearTimersAndFrames();
      pendingTargetRef.current = {
        hash: window.location.hash || null,
        focusOnArrival: false,
        sourcePath: pathname,
      };
      engineRef.current = "fallback";
      transitionKindRef.current = inferTransitionKind(pathname, window.location.pathname);
      document.documentElement.dataset.routeTransition = transitionKindRef.current;
      document.documentElement.dataset.routeTransitionEngine = "fallback";
      document.documentElement.classList.add("routeTransitionActive");
      updatePhase("entering");
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.scrollRestoration = previousRestoration;
      clearTimersAndFrames();
      activeViewTransitionRef.current?.skipTransition();
      resetDocumentTransitionState();
    };
  }, [clearTimersAndFrames, pathname, resetDocumentTransitionState, updatePhase]);

  useLayoutEffect(() => {
    if (!routeRef.current) {
      routeRef.current = routeKey;
      return;
    }
    if (routeRef.current === routeKey) return;

    routeRef.current = routeKey;
    clearTimersAndFrames();

    if (engineRef.current === "native") {
      const frame = window.requestAnimationFrame(() => {
        positionDestination();
        routeCommitResolverRef.current?.();
      });
      framesRef.current.push(frame);
      return;
    }

    updatePhase("entering");
    const firstFrame = window.requestAnimationFrame(() => {
      const { target, focusOnArrival } = positionDestination();
      const secondFrame = window.requestAnimationFrame(() => {
        updatePhase("visible");
        focusDestination(target, focusOnArrival);
        navigationTimerRef.current = window.setTimeout(finishTransition, FALLBACK_ENTER_MS);
      });
      framesRef.current.push(secondFrame);
    });
    framesRef.current.push(firstFrame);
  }, [clearTimersAndFrames, finishTransition, focusDestination, positionDestination, routeKey, updatePhase]);

  const contextValue = useMemo<RouteTransitionContextValue>(() => ({
    navigate,
    transitioning,
  }), [navigate, transitioning]);

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {header}
      <div
        className={`routeFade is-${phase}`}
        data-transition-kind={transitionKindRef.current}
        aria-busy={transitioning || phase !== "visible"}
      >
        {children}
      </div>
      <span className="srOnly" aria-live="polite" aria-atomic="true">
        {transitioning || phase !== "visible" ? "Loading page" : ""}
      </span>
    </RouteTransitionContext.Provider>
  );
}
