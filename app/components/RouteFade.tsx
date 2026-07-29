"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  type TransitionEvent,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TransitionKind = "artist-open" | "artist-close" | "artist-switch" | "page-open" | "page-close" | "page-switch";
type TransitionPhase = "idle" | "covering" | "covered" | "revealing" | "revealing-active";

interface NavigateOptions {
  readonly replace?: boolean;
  readonly focusOnArrival?: boolean;
  readonly transitionKind?: TransitionKind;
}

interface RouteTransitionContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
  prefetch: (href: string) => void;
  transitioning: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const COVER_TIMEOUT_MS = 620;
const REVEAL_TIMEOUT_MS = 620;
const WATCHDOG_MS = 7000;

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

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });
}

async function waitForDestinationLayout() {
  try {
    await document.fonts?.ready;
  } catch {
    // Font loading failure must never block navigation recovery.
  }
  await nextFrame();
}

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
}

export function RouteFade({ children, header }: { readonly children: ReactNode; readonly header?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [transitioning, setTransitioning] = useState(false);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const timersRef = useRef<number[]>([]);
  const transitionKindRef = useRef<TransitionKind>("page-switch");
  const navigationStartedRef = useRef(false);
  const pendingRef = useRef<{
    href: string;
    hash: string | null;
    focusOnArrival: boolean;
    replace: boolean;
  } | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  }, []);

  const timer = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const setTransitionPhase = useCallback((next: TransitionPhase) => {
    setPhase(next);
    document.documentElement.dataset.routePhase = next;
  }, []);

  const unlock = useCallback(() => {
    clearTimers();
    pendingRef.current = null;
    navigationStartedRef.current = false;
    lockRef.current = false;
    setTransitioning(false);
    setTransitionPhase("idle");
    delete document.documentElement.dataset.routeTransition;
    delete document.documentElement.dataset.routePhase;
    document.documentElement.classList.remove("routeTransitionActive");
  }, [clearTimers, setTransitionPhase]);

  const positionDestination = useCallback(() => {
    const pending = pendingRef.current;
    const hash = pending?.hash ?? (window.location.hash || null);
    let target: HTMLElement | null = null;

    if (hash && hash !== "#top") {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    }

    if (hash === "#site-footer") {
      target?.classList.add("isRevealed");
      const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: maximumScroll, left: 0, behavior: "auto" });
    } else if (target) {
      target.classList.add("isRevealed");
      target.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      target = document.querySelector<HTMLElement>("main#main-content");
    }

    if (pending?.focusOnArrival && target) {
      if (!target.matches("a, button, input, textarea, select, [tabindex]")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  }, []);

  const startNavigation = useCallback(() => {
    if (navigationStartedRef.current) return;
    const pending = pendingRef.current;
    if (!pending) return;

    navigationStartedRef.current = true;
    setTransitionPhase("covered");
    if (pending.replace) router.replace(pending.href, { scroll: false });
    else router.push(pending.href, { scroll: false });
  }, [router, setTransitionPhase]);

  const revealDestination = useCallback(async () => {
    positionDestination();
    await waitForDestinationLayout();
    if (!lockRef.current) return;

    // Re-apply after fonts/layout settle so footer and hash destinations are
    // exact before the curtain exposes the new route.
    positionDestination();
    setTransitionPhase("revealing");
    window.requestAnimationFrame(() => {
      if (!lockRef.current) return;
      setTransitionPhase("revealing-active");
      timer(unlock, reducedMotion() ? 30 : REVEAL_TIMEOUT_MS);
    });
  }, [positionDestination, setTransitionPhase, timer, unlock]);

  const handleVeilTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== veilRef.current || event.propertyName !== "transform") return;
    if (phase === "covering") startNavigation();
    if (phase === "revealing-active") unlock();
  }, [phase, startNavigation, unlock]);

  const prefetch = useCallback((href: string) => {
    try {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      router.prefetch(`${destination.pathname}${destination.search}`);
    } catch {
      // External or malformed URLs are left to the browser.
    }
  }, [router]);

  const navigate = useCallback((href: string, options?: NavigateOptions) => {
    if (lockRef.current) return;

    const destination = new URL(href, window.location.href);
    const current = new URL(window.location.href);
    const sameDocumentRoute = destination.pathname === current.pathname && destination.search === current.search;

    if (sameDocumentRoute) {
      const hash = destination.hash || "#top";
      const target = hash === "#top" ? null : document.getElementById(decodeURIComponent(hash.slice(1)));
      window.history.pushState(window.history.state, "", hash);
      if (hash === "#site-footer") {
        const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: maximumScroll, left: 0, behavior: reducedMotion() ? "auto" : "smooth" });
      } else if (target) {
        target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: reducedMotion() ? "auto" : "smooth" });
      }
      if (options?.focusOnArrival) (target ?? document.querySelector<HTMLElement>("main#main-content"))?.focus({ preventScroll: true });
      return;
    }

    clearTimers();
    lockRef.current = true;
    navigationStartedRef.current = false;
    setTransitioning(true);

    const kind = options?.transitionKind ?? inferTransitionKind(current.pathname, destination.pathname);
    transitionKindRef.current = kind;
    pendingRef.current = {
      href: `${destination.pathname}${destination.search}${destination.hash}`,
      hash: destination.hash || null,
      focusOnArrival: Boolean(options?.focusOnArrival),
      replace: Boolean(options?.replace),
    };

    try {
      if (destination.hash) sessionStorage.setItem("shf-route-target", destination.hash);
      else sessionStorage.removeItem("shf-route-target");
    } catch {
      // Storage can be unavailable in private browsing.
    }

    document.documentElement.dataset.routeTransition = kind;
    document.documentElement.classList.add("routeTransitionActive");
    setTransitionPhase("covering");

    // transitionend is the primary trigger; this bounded fallback protects
    // navigation if Safari suppresses the event during interruption.
    timer(startNavigation, reducedMotion() ? 0 : COVER_TIMEOUT_MS);
    timer(unlock, WATCHDOG_MS);
  }, [clearTimers, setTransitionPhase, startNavigation, timer, unlock]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
      clearTimers();
      delete document.documentElement.dataset.routeTransition;
      delete document.documentElement.dataset.routePhase;
      document.documentElement.classList.remove("routeTransitionActive");
    };
  }, [clearTimers]);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    if (lockRef.current) {
      void revealDestination();
      return;
    }

    positionDestination();
  }, [pathname, positionDestination, revealDestination]);

  const value = useMemo<RouteTransitionContextValue>(() => ({ navigate, prefetch, transitioning }), [navigate, prefetch, transitioning]);

  return (
    <RouteTransitionContext.Provider value={value}>
      {header}
      <div className={`routeFade routeFade--${phase}`} data-live-route data-transition-kind={transitionKindRef.current} aria-busy={transitioning}>
        {children}
      </div>
      <div
        ref={veilRef}
        className="routeTransitionVeil"
        aria-hidden="true"
        onTransitionEnd={handleVeilTransitionEnd}
      />
      <span className="srOnly" aria-live="polite" aria-atomic="true">
        {transitioning ? "Loading page" : ""}
      </span>
    </RouteTransitionContext.Provider>
  );
}
