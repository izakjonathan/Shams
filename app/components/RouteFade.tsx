"use client";

import { usePathname, useRouter } from "next/navigation";
import { afterPaint, cssTimeMs, prefersReducedMotion } from "../lib/motion";
import { scrollToDocumentBottom } from "../lib/viewport";
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
const WATCHDOG_MS = 4200;
const FALLBACK_BUFFER_MS = 90;

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

function curtainDuration(kind: TransitionKind, phase: "cover" | "reveal"): number {
  if (prefersReducedMotion()) return 1;
  if (phase === "reveal") return cssTimeMs("--route-curtain-reveal-duration", 550);
  if (kind === "artist-close" || kind === "page-close") return cssTimeMs("--route-curtain-close-duration", 500);
  if (kind === "artist-switch" || kind === "page-switch") return cssTimeMs("--route-curtain-switch-duration", 470);
  return cssTimeMs("--route-curtain-open-duration", 550);
}

function nextPaint() {
  return new Promise<void>((resolve) => afterPaint(resolve));
}

function clearManagedHash() {
  if (!window.location.hash) return;
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
}


function focusElement(target: HTMLElement | null) {
  if (!target) return;
  const addedTabIndex = !target.matches("a, button, input, textarea, select, [tabindex]");
  if (addedTabIndex) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  if (addedTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
}

async function waitForDestinationLayout() {
  try {
    await document.fonts?.ready;
  } catch {
    // Font loading failure must never block navigation recovery.
  }
  await nextPaint();
}

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
}

export function RouteFade({ children, header }: { readonly children: ReactNode; readonly header?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [kind, setKind] = useState<TransitionKind>("page-switch");
  const [transitioning, setTransitioning] = useState(false);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const timersRef = useRef<Set<number>>(new Set());
  const cancelMountPaintRef = useRef<(() => void) | null>(null);
  const navigationStartedRef = useRef(false);
  const pendingRef = useRef<{
    href: string;
    hash: string | null;
    focusOnArrival: boolean;
    replace: boolean;
  } | null>(null);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current.clear();
  }, []);

  const timer = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      callback();
    }, delay);
    timersRef.current.add(id);
    return id;
  }, []);

  const unlock = useCallback(() => {
    clearTimers();
    cancelMountPaintRef.current?.();
    cancelMountPaintRef.current = null;
    pendingRef.current = null;
    navigationStartedRef.current = false;
    lockRef.current = false;
    setTransitioning(false);
    setPhase("idle");
  }, [clearTimers]);

  const positionDestination = useCallback(() => {
    const pending = pendingRef.current;
    const hash = pending?.hash ?? (window.location.hash || null);
    let target: HTMLElement | null = null;

    if (hash && hash !== "#top") target = document.getElementById(decodeURIComponent(hash.slice(1)));

    if (hash === "#site-footer") {
      target?.classList.add("isRevealed");
      scrollToDocumentBottom("auto");
    } else if (target) {
      target.classList.add("isRevealed");
      target.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      target = document.querySelector<HTMLElement>("main#main-content");
    }

    if (pending?.hash) clearManagedHash();
    if (pending?.focusOnArrival) focusElement(target);
  }, []);

  const startNavigation = useCallback(() => {
    if (navigationStartedRef.current) return;
    const pending = pendingRef.current;
    if (!pending) return;
    navigationStartedRef.current = true;
    setPhase("covered");
    if (pending.replace) router.replace(pending.href, { scroll: false });
    else router.push(pending.href, { scroll: false });
  }, [router]);

  const revealDestination = useCallback(async () => {
    positionDestination();
    await waitForDestinationLayout();
    if (!lockRef.current) return;
    positionDestination();
    setPhase("revealing");
    window.requestAnimationFrame(() => {
      if (!lockRef.current) return;
      setPhase("revealing-active");
      timer(unlock, curtainDuration(kind, "reveal") + FALLBACK_BUFFER_MS);
    });
  }, [kind, positionDestination, timer, unlock]);

  const handleVeilTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== veilRef.current || event.propertyName !== "transform") return;
    if (phase === "covering") startNavigation();
    else if (phase === "revealing-active") unlock();
  }, [phase, startNavigation, unlock]);

  const prefetch = useCallback((href: string) => {
    try {
      const destination = new URL(href, window.location.href);
      if (destination.origin === window.location.origin) router.prefetch(`${destination.pathname}${destination.search}`);
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
      const behavior = prefersReducedMotion() ? "auto" : "smooth";
      if (hash === "#site-footer") scrollToDocumentBottom(behavior);
      else if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior });
      clearManagedHash();
      if (options?.focusOnArrival) focusElement(target ?? document.querySelector<HTMLElement>("main#main-content"));
      return;
    }

    clearTimers();
    lockRef.current = true;
    navigationStartedRef.current = false;
    const nextKind = options?.transitionKind ?? inferTransitionKind(current.pathname, destination.pathname);
    setKind(nextKind);
    pendingRef.current = {
      href: `${destination.pathname}${destination.search}`,
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

    setPhase("idle");
    setTransitioning(true);
    cancelMountPaintRef.current?.();
    cancelMountPaintRef.current = afterPaint(() => {
      cancelMountPaintRef.current = null;
      if (!lockRef.current) return;
      setPhase("covering");
      timer(startNavigation, curtainDuration(nextKind, "cover") + FALLBACK_BUFFER_MS);
    });
    timer(unlock, WATCHDOG_MS);
  }, [clearTimers, startNavigation, timer, unlock]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
      clearTimers();
      cancelMountPaintRef.current?.();
    };
  }, [clearTimers]);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;
    if (lockRef.current) void revealDestination();
    else positionDestination();
  }, [pathname, positionDestination, revealDestination]);

  const value = useMemo<RouteTransitionContextValue>(() => ({ navigate, prefetch, transitioning }), [navigate, prefetch, transitioning]);
  return (
    <RouteTransitionContext.Provider value={value}>
      {header}
      <div
        className="routeFade"
        data-live-route
        data-route-phase={phase}
        aria-busy={transitioning}
      >
        {children}
      </div>
      {transitioning && (
        <div
          ref={veilRef}
          className="routeTransitionVeil"
          data-route-phase={phase}
          data-route-kind={kind}
          aria-hidden="true"
          onTransitionEnd={handleVeilTransitionEnd}
        />
      )}
      <span className="srOnly" aria-live="polite" aria-atomic="true">
        {transitioning ? "Loading page" : ""}
      </span>
    </RouteTransitionContext.Provider>
  );
}
