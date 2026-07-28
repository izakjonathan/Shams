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

type TransitionKind = "artist-open" | "artist-close" | "artist-switch" | "page-open" | "page-close" | "page-switch";
type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

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

const COVER_MS = 550;
const REVEAL_MS = 550;
const WATCHDOG_MS = 4500;

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

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
}

export function RouteFade({ children, header }: { readonly children: ReactNode; readonly header?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [transitioning, setTransitioning] = useState(false);
  const phaseRef = useRef<TransitionPhase>("idle");
  const lockRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const timersRef = useRef<number[]>([]);
  const framesRef = useRef<number[]>([]);
  const transitionKindRef = useRef<TransitionKind>("page-switch");
  const pendingRef = useRef<{
    href: string;
    hash: string | null;
    focusOnArrival: boolean;
  } | null>(null);

  const clearAsync = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    framesRef.current.forEach(window.cancelAnimationFrame);
    timersRef.current = [];
    framesRef.current = [];
  }, []);

  const timer = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const frame = useCallback((callback: FrameRequestCallback) => {
    const id = window.requestAnimationFrame(callback);
    framesRef.current.push(id);
    return id;
  }, []);

  const setTransitionPhase = useCallback((next: TransitionPhase) => {
    phaseRef.current = next;
    setPhase(next);
    document.documentElement.dataset.routePhase = next;
  }, []);

  const unlock = useCallback(() => {
    clearAsync();
    pendingRef.current = null;
    lockRef.current = false;
    setTransitioning(false);
    setTransitionPhase("idle");
    delete document.documentElement.dataset.routeTransition;
    delete document.documentElement.dataset.routePhase;
    document.documentElement.classList.remove("routeTransitionActive");
  }, [clearAsync, setTransitionPhase]);

  const positionDestination = useCallback(() => {
    const pending = pendingRef.current;
    const hash = pending?.hash ?? (window.location.hash || null);
    let target: HTMLElement | null = null;

    if (hash && hash !== "#top") {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (hash.startsWith("#artist-")) {
        document.querySelectorAll<HTMLElement>("#lineup .revealItem").forEach((item) => {
          item.classList.add("isRevealed");
          item.style.willChange = "auto";
        });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    return target;
  }, []);

  const revealDestination = useCallback(() => {
    const target = positionDestination();
    setTransitionPhase("revealing");

    frame(() => {
      document.documentElement.dataset.routePhase = "revealing-active";
      frame(() => {
        if (pendingRef.current?.focusOnArrival) {
          (target ?? document.querySelector<HTMLElement>("main#main-content"))?.focus({ preventScroll: true });
        }
        timer(unlock, reducedMotion() ? 20 : REVEAL_MS);
      });
    });
  }, [frame, positionDestination, setTransitionPhase, timer, unlock]);

  const prefetch = useCallback((href: string) => {
    try {
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      router.prefetch(`${destination.pathname}${destination.search}`);
    } catch {
      // Leave malformed or external URLs to the browser.
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
      if (target) target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: reducedMotion() ? "auto" : "smooth" });
      if (options?.focusOnArrival) (target ?? document.querySelector<HTMLElement>("main#main-content"))?.focus({ preventScroll: true });
      return;
    }

    clearAsync();
    lockRef.current = true;
    setTransitioning(true);

    const kind = options?.transitionKind ?? inferTransitionKind(current.pathname, destination.pathname);
    transitionKindRef.current = kind;
    pendingRef.current = {
      href: `${destination.pathname}${destination.search}${destination.hash}`,
      hash: destination.hash || null,
      focusOnArrival: Boolean(options?.focusOnArrival),
    };

    document.documentElement.dataset.routeTransition = kind;
    document.documentElement.classList.add("routeTransitionActive");
    setTransitionPhase("covering");

    const coverDuration = reducedMotion() ? 0 : COVER_MS;

    timer(() => {
      setTransitionPhase("covered");
      const nextHref = pendingRef.current?.href;
      if (!nextHref) return unlock();
      if (options?.replace) router.replace(nextHref, { scroll: false });
      else router.push(nextHref, { scroll: false });
    }, coverDuration);

    timer(unlock, WATCHDOG_MS);
  }, [clearAsync, router, setTransitionPhase, timer, unlock]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
      clearAsync();
      delete document.documentElement.dataset.routeTransition;
      delete document.documentElement.dataset.routePhase;
      document.documentElement.classList.remove("routeTransitionActive");
    };
  }, [clearAsync]);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    if (lockRef.current) {
      revealDestination();
      return;
    }

    // Browser back/forward navigation cannot be covered before the URL change,
    // so make the committed page settle immediately and visibly.
    positionDestination();
    setTransitionPhase("revealing");
    frame(() => {
      document.documentElement.dataset.routePhase = "revealing-active";
      timer(unlock, reducedMotion() ? 20 : 220);
    });
  }, [frame, pathname, positionDestination, revealDestination, setTransitionPhase, timer, unlock]);

  const value = useMemo<RouteTransitionContextValue>(() => ({ navigate, prefetch, transitioning }), [navigate, prefetch, transitioning]);

  return (
    <RouteTransitionContext.Provider value={value}>
      {header}
      <div className={`routeFade routeFade--${phase}`} data-transition-kind={transitionKindRef.current} aria-busy={transitioning}>
        {children}
      </div>
      <div className="routeTransitionVeil" aria-hidden="true" />
      <span className="srOnly" aria-live="polite" aria-atomic="true">
        {transitioning ? "Loading page" : ""}
      </span>
    </RouteTransitionContext.Provider>
  );
}
