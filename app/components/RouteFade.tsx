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
type TransitionPhase = "idle" | "covering" | "covered" | "revealing" | "morph-waiting" | "morph-revealing";

interface NavigateOptions {
  readonly replace?: boolean;
  readonly focusOnArrival?: boolean;
  readonly transitionKind?: TransitionKind;
  readonly morphSource?: HTMLElement | null;
}

interface RouteTransitionContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
  prefetch: (href: string) => void;
  transitioning: boolean;
}

interface MorphLayer {
  snapshot: HTMLDivElement;
  title: HTMLDivElement;
  sourceRect: DOMRect;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue | null>(null);

const COVER_MS = 550;
const REVEAL_MS = 550;
const WATCHDOG_MS = 5000;
const MORPH_MS = 520;
const MORPH_WATCHDOG_MS = 4200;

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

function isArtistTransition(kind: TransitionKind) {
  return kind === "artist-open" || kind === "artist-close" || kind === "artist-switch";
}

function findSourceTitle(source?: HTMLElement | null) {
  const shell = source?.closest<HTMLElement>("[data-artist-morph-shell]")
    ?? document.querySelector<HTMLElement>("[data-artist-page-shell]");
  return shell?.querySelector<HTMLElement>("[data-artist-morph-title]")
    ?? document.querySelector<HTMLElement>("[data-artist-morph-title]");
}

function copyTitleStyles(source: HTMLElement, clone: HTMLElement) {
  const style = window.getComputedStyle(source);
  const properties = [
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "font-stretch",
    "font-variation-settings",
    "letter-spacing",
    "line-height",
    "text-align",
    "text-transform",
    "text-decoration",
    "color",
    "white-space",
  ];
  properties.forEach((property) => clone.style.setProperty(property, style.getPropertyValue(property)));
}

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
}

export function RouteFade({ children, header }: { readonly children: ReactNode; readonly header?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [transitioning, setTransitioning] = useState(false);
  const lockRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const timersRef = useRef<number[]>([]);
  const framesRef = useRef<number[]>([]);
  const transitionKindRef = useRef<TransitionKind>("page-switch");
  const morphLayerRef = useRef<MorphLayer | null>(null);
  const destinationTitleRef = useRef<HTMLElement | null>(null);
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
    setPhase(next);
    document.documentElement.dataset.routePhase = next;
  }, []);

  const removeMorphLayer = useCallback(() => {
    destinationTitleRef.current?.style.removeProperty("visibility");
    destinationTitleRef.current = null;
    morphLayerRef.current?.snapshot.remove();
    morphLayerRef.current?.title.remove();
    morphLayerRef.current = null;
  }, []);

  const unlock = useCallback(() => {
    clearAsync();
    removeMorphLayer();
    pendingRef.current = null;
    lockRef.current = false;
    setTransitioning(false);
    setTransitionPhase("idle");
    delete document.documentElement.dataset.routeTransition;
    delete document.documentElement.dataset.routePhase;
    document.documentElement.classList.remove("routeTransitionActive", "manualArtistMorphActive");
  }, [clearAsync, removeMorphLayer, setTransitionPhase]);

  const createMorphLayer = useCallback((source?: HTMLElement | null) => {
    const route = document.querySelector<HTMLElement>(".routeFade");
    const sourceTitle = findSourceTitle(source);
    if (!route || !sourceTitle) return false;

    const sourceRect = sourceTitle.getBoundingClientRect();
    if (sourceRect.width <= 0 || sourceRect.height <= 0) return false;

    const snapshot = document.createElement("div");
    snapshot.className = "artistMorphSnapshot";
    snapshot.setAttribute("aria-hidden", "true");

    const routeClone = route.cloneNode(true) as HTMLElement;
    routeClone.removeAttribute("aria-busy");
    routeClone.querySelectorAll<HTMLElement>("a, button, input, textarea, select").forEach((element) => {
      element.setAttribute("tabindex", "-1");
    });

    const sourceShell = sourceTitle.closest<HTMLElement>("[data-artist-morph-shell]")
      ?? sourceTitle.closest<HTMLElement>("[data-artist-page-shell]");
    const sourceShellId = sourceShell?.id;
    const clonedTitle = sourceShellId
      ? routeClone.querySelector<HTMLElement>(`#${CSS.escape(sourceShellId)} [data-artist-morph-title]`)
      : routeClone.querySelector<HTMLElement>("[data-artist-page-shell] [data-artist-morph-title]");
    if (clonedTitle) clonedTitle.style.visibility = "hidden";

    const routeRect = route.getBoundingClientRect();
    routeClone.style.position = "absolute";
    routeClone.style.left = `${routeRect.left}px`;
    routeClone.style.top = `${routeRect.top}px`;
    routeClone.style.width = `${routeRect.width}px`;
    routeClone.style.minHeight = `${route.scrollHeight}px`;
    routeClone.style.pointerEvents = "none";
    snapshot.appendChild(routeClone);

    const title = document.createElement("div");
    title.className = "artistMorphFloatingTitle";
    title.textContent = sourceTitle.textContent;
    copyTitleStyles(sourceTitle, title);
    title.style.left = `${sourceRect.left}px`;
    title.style.top = `${sourceRect.top}px`;
    title.style.width = `${sourceRect.width}px`;
    title.style.height = `${sourceRect.height}px`;

    document.body.append(snapshot, title);
    morphLayerRef.current = { snapshot, title, sourceRect };
    return true;
  }, []);

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

  const revealMorphDestination = useCallback(() => {
    const layer = morphLayerRef.current;
    const target = positionDestination();
    const destinationShell = target?.matches("[data-artist-morph-shell]")
      ? target
      : document.querySelector<HTMLElement>("[data-artist-page-shell]");
    const destinationTitle = destinationShell?.querySelector<HTMLElement>("[data-artist-morph-title]")
      ?? document.querySelector<HTMLElement>("[data-artist-morph-title]");

    if (!layer || !destinationTitle) {
      unlock();
      return;
    }

    destinationTitleRef.current = destinationTitle;
    destinationTitle.style.visibility = "hidden";
    setTransitionPhase("morph-revealing");

    frame(() => {
      const destinationRect = destinationTitle.getBoundingClientRect();
      const deltaX = destinationRect.left - layer.sourceRect.left;
      const deltaY = destinationRect.top - layer.sourceRect.top;
      const scaleX = destinationRect.width / layer.sourceRect.width;
      const scaleY = destinationRect.height / layer.sourceRect.height;

      document.documentElement.dataset.routePhase = "morph-revealing-active";

      const snapshotAnimation = layer.snapshot.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: reducedMotion() ? 1 : 420, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "forwards" },
      );

      const titleAnimation = layer.title.animate(
        [
          { transform: "translate3d(0, 0, 0) scale(1, 1)", opacity: 1 },
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`, opacity: 1 },
        ],
        { duration: reducedMotion() ? 1 : MORPH_MS, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "forwards" },
      );

      Promise.allSettled([snapshotAnimation.finished, titleAnimation.finished]).finally(() => {
        destinationTitle.style.removeProperty("visibility");
        if (pendingRef.current?.focusOnArrival) {
          (target ?? document.querySelector<HTMLElement>("main#main-content"))?.focus({ preventScroll: true });
        }
        unlock();
      });
    });
  }, [frame, positionDestination, setTransitionPhase, unlock]);

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

    const useMorph = isArtistTransition(kind) && !reducedMotion() && createMorphLayer(options?.morphSource);
    const nextHref = pendingRef.current.href;

    if (useMorph) {
      document.documentElement.classList.add("manualArtistMorphActive");
      setTransitionPhase("morph-waiting");
      if (options?.replace) router.replace(nextHref, { scroll: false });
      else router.push(nextHref, { scroll: false });
      timer(unlock, MORPH_WATCHDOG_MS);
      return;
    }

    document.documentElement.classList.add("routeTransitionActive");
    setTransitionPhase("covering");
    const coverDuration = reducedMotion() ? 0 : COVER_MS;
    timer(() => {
      setTransitionPhase("covered");
      if (options?.replace) router.replace(nextHref, { scroll: false });
      else router.push(nextHref, { scroll: false });
    }, coverDuration);
    timer(unlock, WATCHDOG_MS);
  }, [clearAsync, createMorphLayer, router, setTransitionPhase, timer, unlock]);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
      clearAsync();
      removeMorphLayer();
      delete document.documentElement.dataset.routeTransition;
      delete document.documentElement.dataset.routePhase;
      document.documentElement.classList.remove("routeTransitionActive", "manualArtistMorphActive");
    };
  }, [clearAsync, removeMorphLayer]);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;

    if (lockRef.current && isArtistTransition(transitionKindRef.current) && morphLayerRef.current) {
      revealMorphDestination();
      return;
    }

    if (lockRef.current) {
      revealDestination();
      return;
    }

    positionDestination();
  }, [pathname, positionDestination, revealDestination, revealMorphDestination]);

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
