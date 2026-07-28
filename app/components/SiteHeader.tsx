"use client";

import { FadeLink } from "./FadeLink";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type TransitionEvent,
} from "react";
import { event } from "../lib/content";

type MenuPhase = "closed" | "opening" | "open" | "closing";

const MENU_EXIT_FALLBACK_MS = 650;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function SiteHeader() {
  const [menuPhase, setMenuPhase] = useState<MenuPhase>("closed");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const enterFrameRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const hasOpenedRef = useRef(false);
  const keyboardMenuInteractionRef = useRef(false);
  const suppressFocusRestoreRef = useRef(false);

  const menuMounted = menuPhase !== "closed";
  const menuExpanded = menuPhase === "opening" || menuPhase === "open";
  const menuVisible = menuPhase === "open";

  useEffect(() => {
    if (menuPhase !== "opening") return;

    // Paint the translated starting state before beginning the opening motion.
    enterFrameRef.current = window.requestAnimationFrame(() => {
      enterFrameRef.current = window.requestAnimationFrame(() => {
        setMenuPhase("open");
      });
    });

    return () => {
      if (enterFrameRef.current !== null) {
        window.cancelAnimationFrame(enterFrameRef.current);
        enterFrameRef.current = null;
      }
    };
  }, [menuPhase]);

  useEffect(() => {
    const backgroundRegions = Array.from(
      document.querySelectorAll<HTMLElement>("main, .siteFooter, .skipLink")
    );

    for (const region of backgroundRegions) region.inert = menuMounted;

    return () => {
      for (const region of backgroundRegions) region.inert = false;
    };
  }, [menuMounted]);

  useEffect(() => {
    if (!menuMounted) return;

    const menu = menuRef.current;
    if (!menu) return;

    const menuFocusable = Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const focusable = [menuButtonRef.current, ...menuFocusable].filter(
      (element): element is HTMLElement => Boolean(element)
    );

    if (menuVisible && keyboardMenuInteractionRef.current) {
      menuFocusable[0]?.focus({ preventScroll: true });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (menuExpanded && event.key === "Escape") {
        event.preventDefault();
        setMenuPhase("closing");
        return;
      }

      if (!menuVisible || event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuExpanded, menuMounted, menuVisible]);

  useEffect(() => {
    if (menuPhase !== "closing") return;

    // transitionend is primary; this covers interrupted/reduced-motion exits.
    exitTimerRef.current = window.setTimeout(() => {
      setMenuPhase("closed");
    }, MENU_EXIT_FALLBACK_MS);

    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [menuPhase]);

  useEffect(() => {
    if (menuPhase === "open") hasOpenedRef.current = true;

    if (
      menuPhase === "closed" &&
      hasOpenedRef.current &&
      keyboardMenuInteractionRef.current &&
      !suppressFocusRestoreRef.current
    ) {
      menuButtonRef.current?.focus({ preventScroll: true });
    }

    if (menuPhase === "closed") suppressFocusRestoreRef.current = false;
  }, [menuPhase]);

  const closeMenu = () => {
    if (!keyboardMenuInteractionRef.current) {
      (document.activeElement as HTMLElement | null)?.blur();
    }

    if (menuPhase === "opening" || menuPhase === "open") {
      setMenuPhase("closing");
    }
  };


  const closeMenuForNavigation = () => {
    suppressFocusRestoreRef.current = true;
    if (enterFrameRef.current !== null) window.cancelAnimationFrame(enterFrameRef.current);
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    enterFrameRef.current = null;
    exitTimerRef.current = null;
    (document.activeElement as HTMLElement | null)?.blur();
    setMenuPhase("closed");
  };

  const handleMenuPointerDown = () => {
    keyboardMenuInteractionRef.current = false;
  };

  const handleMenuButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      keyboardMenuInteractionRef.current = true;
    }
  };

  const toggleMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    // A click with detail 0 is generated by keyboard or assistive technology.
    if (event.detail === 0) keyboardMenuInteractionRef.current = true;

    if (!keyboardMenuInteractionRef.current) {
      window.requestAnimationFrame(() => menuButtonRef.current?.blur());
    }

    if (menuPhase === "closed") {
      setMenuPhase("opening");
    } else if (menuPhase !== "closing") {
      closeMenu();
    }
  };

  const handleMenuTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      menuPhase === "closing" &&
      event.target === event.currentTarget &&
      event.propertyName === "transform"
    ) {
      setMenuPhase("closed");
    }
  };

  return (
    <>
      <header className="siteHeader">
        <FadeLink
          className="brand"
          href="/#top"
          aria-label="Shams for Humanity home"
          inert={menuMounted}
        >
          <span className="brandMark" aria-hidden="true">✦</span>
          <span>SHAMS / HUMANITY</span>
        </FadeLink>
        <nav className="desktopNav" aria-label="Primary navigation" inert={menuMounted}>
          <FadeLink href="/#about">About</FadeLink>
          <FadeLink href="/#lineup">Artists</FadeLink>
          <FadeLink href="/#info">Info</FadeLink>
          <FadeLink href="/#tickets">Tickets</FadeLink>
        </nav>
        <button
          ref={menuButtonRef}
          className="menuButton"
          type="button"
          onPointerDown={handleMenuPointerDown}
          onKeyDown={handleMenuButtonKeyDown}
          onClick={toggleMenu}
          aria-expanded={menuExpanded}
          aria-controls="mobile-menu"
          aria-label={menuMounted ? "Close navigation menu" : "Open navigation menu"}
        >
          <span>{menuMounted ? "Close" : "Menu"}</span>
          <span className="menuIcon" aria-hidden="true">{menuMounted ? "×" : "＋"}</span>
        </button>
      </header>

      {menuMounted && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className={`mobileMenu${menuVisible ? " isOpen" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          aria-hidden={!menuVisible}
          inert={!menuVisible}
          onPointerDown={handleMenuPointerDown}
          onTransitionEnd={handleMenuTransitionEnd}
        >
          <nav aria-label="Mobile navigation">
            <FadeLink onBeforeNavigate={closeMenuForNavigation} href="/#about">About <span>01</span></FadeLink>
            <FadeLink onBeforeNavigate={closeMenuForNavigation} href="/#lineup">Artists <span>02</span></FadeLink>
            <FadeLink onBeforeNavigate={closeMenuForNavigation} href="/#info">Event info <span>03</span></FadeLink>
            <FadeLink onBeforeNavigate={closeMenuForNavigation} href="/#tickets">Tickets <span>04</span></FadeLink>
          </nav>
          <p>{event.city} · {event.date}</p>
        </div>
      )}
    </>
  );
}
