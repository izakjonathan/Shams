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

const FALLBACK_EXIT_MS = 330;
const FALLBACK_ENTER_MS = 450;
const NATIVE_COMMIT_TIMEOUT_MS = 2200;
const NAVIGATION_WATCHDOG_MS = 4200;

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
  activeViewTransition?: ViewTransitionLike | null;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
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
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("visible");
  const [transitioning, setTransitioning] = useState(false);
  const phaseRef = useRef<TransitionPhase>("visible");
  const lockRef = useRef(false);
  const engineRef = useRef<TransitionEngine | null>(null);
  const transitionKindRef = useRef<TransitionKind>("page-switch");
  const timersRef = useRef<number[]>([]);
  const framesRef = useRef<number[]>([]);
  const previousPathRef = useRef(pathname);
  const routeCommitResolverRef = useRef<(() => void) | null>(null);
  const activeViewTransitionRef = useRef<ViewTransitionLike | null>(null);
  const pendingTargetRef = useRef<{
    hash: string | null;
    focusOnArrival: boolean;
  } | null>(null);

  const clearAsyncWork = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    framesRef.current.forEach((frame) => window.cancelAnimationFrame(frame));
    framesRef.current = [];
  }, []);

  const scheduleTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
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
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

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
    clearAsyncWork();
    routeCommitResolverRef.current?.();
    routeCommitResolverRef.current = null;
    pendingTargetRef.current = null;
    activeViewTransitionRef.current = null;
    engineRef.current = null;
    lockRef.current = false;
    setTransitioning(false);
    updatePhase("visible");
    resetDocumentTransitionState();
    try { sessionStorage.removeItem("shf-route-target"); } catch {}
  }, [clearAsyncWork, resetDocumentTransitionState, updatePhase]);

  const recoverTransition = useCallback(() => {
    try { activeViewTransitionRef.current?.skipTransition(); } catch {}
    finishTransition();
  }, [finishTransition]);

  const performRouterNavigation = useCallback((href: string, replace?: boolean) => {
    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  }, [router]);

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    const viewDocument = document as ViewTransitionDocument;
    if (lockRef.current || phaseRef.current !== "visible" || activeViewTransitionRef.current || viewDocument.activeViewTransition) return;

    const destination = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    const sameRoute = destination.pathname === current.pathname && destination.search === current.search;

    if (sameRoute) {
      const hash = destination.hash || "#top";
      const target = hash === "#top" ? null : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      window.history.pushState(window.history.state, "", hash);
      if (options?.focusOnArrival) (target ?? document.querySelector<HTMLElement>("main#main-content"))?.focus({ preventScroll: true });
      return;
    }

    clearAsyncWork();
    lockRef.current = true;
    setTransitioning(true);

    const transitionKind = options?.transitionKind ?? inferTransitionKind(current.pathname, destination.pathname);
    transitionKindRef.current = transitionKind;
    pendingTargetRef.current = {
      hash: destination.hash || null,
      focusOnArrival: Boolean(options?.focusOnArrival),
    };

    try { sessionStorage.setItem("shf-route-target", destination.hash || "#top"); } catch {}

    const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
    const nativeTransition = viewDocument.startViewTransition;
    const canUseNative = Boolean(nativeTransition) && !prefersReducedMotion();

    document.documentElement.dataset.routeTransition = transitionKind;
    document.documentElement.dataset.routeTransitionEngine = canUseNative ? "native" : "fallback";
    document.documentElement.classList.add("routeTransitionActive");
    scheduleTimer(recoverTransition, NAVIGATION_WATCHDOG_MS);

    if (canUseNative && nativeTransition) {
      engineRef.current = "native";
      const routeCommitted = new Promise<void>((resolve) => {
        let resolved = false;
        const resolveOnce = () => {
          if (resolved) return;
          resolved = true;
          resolve();
        };
        routeCommitResolverRef.current = resolveOnce;
        scheduleTimer(resolveOnce, NATIVE_COMMIT_TIMEOUT_MS);
      });

      try {
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
      } catch {
        engineRef.current = "fallback";
        activeViewTransitionRef.current = null;
        updatePhase("exiting");
        scheduleTimer(() => performRouterNavigation(nextHref, options?.replace), FALLBACK_EXIT_MS);
      }
      return;
    }

    engineRef.current = "fallback";
    updatePhase("exiting");
    scheduleTimer(() => performRouterNavigation(nextHref, options?.replace), FALLBACK_EXIT_MS);
  }, [clearAsyncWork, finishTransition, focusDestination, performRouterNavigation, positionDestination, recoverTransition, scheduleTimer, updatePhase]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handlePopState = () => {
      if (lockRef.current) return;
      const destination = new URL(window.location.href);
      lockRef.current = true;
      setTransitioning(true);
      engineRef.current = "fallback";
      transitionKindRef.current = inferTransitionKind(previousPathRef.current, destination.pathname);
      pendingTargetRef.current = {
        hash: destination.hash || null,
        focusOnArrival: false,
      };
      document.documentElement.dataset.routeTransition = transitionKindRef.current;
      document.documentElement.dataset.routeTransitionEngine = "fallback";
      document.documentElement.classList.add("routeTransitionActive");
      updatePhase("entering");
      scheduleTimer(recoverTransition, NAVIGATION_WATCHDOG_MS);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.scrollRestoration = previousRestoration;
      try { activeViewTransitionRef.current?.skipTransition(); } catch {}
      clearAsyncWork();
      resetDocumentTransitionState();
    };
  }, [clearAsyncWork, recoverTransition, resetDocumentTransitionState, scheduleTimer, updatePhase]);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    if (!lockRef.current) {
      const frame = window.requestAnimationFrame(() => positionDestination());
      framesRef.current.push(frame);
      return;
    }

    if (engineRef.current === "native") {
      const firstFrame = window.requestAnimationFrame(() => {
        positionDestination();
        const secondFrame = window.requestAnimationFrame(() => {
          routeCommitResolverRef.current?.();
        });
        framesRef.current.push(secondFrame);
      });
      framesRef.current.push(firstFrame);
      return;
    }

    updatePhase("entering");
    const firstFrame = window.requestAnimationFrame(() => {
      const { target, focusOnArrival } = positionDestination();
      const secondFrame = window.requestAnimationFrame(() => {
        updatePhase("visible");
        focusDestination(target, focusOnArrival);
        scheduleTimer(finishTransition, FALLBACK_ENTER_MS);
      });
      framesRef.current.push(secondFrame);
    });
    framesRef.current.push(firstFrame);
  }, [finishTransition, focusDestination, pathname, positionDestination, scheduleTimer, updatePhase]);

  const contextValue = useMemo<RouteTransitionContextValue>(() => ({ navigate, transitioning }), [navigate, transitioning]);

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
