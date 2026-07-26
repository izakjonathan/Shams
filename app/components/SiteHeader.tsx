"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
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
    if (!menuMounted) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusable = Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (menuVisible && keyboardMenuInteractionRef.current) {
      focusable[0]?.focus({ preventScroll: true });
    }

    const preventPointerScroll = (event: Event) => event.preventDefault();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (menuExpanded && event.key === "Escape") {
        event.preventDefault();
        setMenuPhase("closing");
        return;
      }

      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        const target = event.target as HTMLElement | null;
        const isEditable =
          target?.isContentEditable ||
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.tagName === "SELECT";

        if (!isEditable) event.preventDefault();
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

    menu.addEventListener("touchmove", preventPointerScroll, { passive: false });
    menu.addEventListener("wheel", preventPointerScroll, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      menu.removeEventListener("touchmove", preventPointerScroll);
      menu.removeEventListener("wheel", preventPointerScroll);
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
      keyboardMenuInteractionRef.current
    ) {
      menuButtonRef.current?.focus({ preventScroll: true });
    }
  }, [menuPhase]);

  const closeMenu = () => {
    if (!keyboardMenuInteractionRef.current) {
      (document.activeElement as HTMLElement | null)?.blur();
    }

    if (menuPhase === "opening" || menuPhase === "open") {
      setMenuPhase("closing");
    }
  };

  const handleMenuPointerDown = () => {
    keyboardMenuInteractionRef.current = false;
  };

  const handleMenuButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      keyboardMenuInteractionRef.current = true;
    }
  };

  const toggleMenu = () => {
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
        <a className="brand" href="#top" aria-label="Shams for Humanity home">
          <span className="brandMark" aria-hidden="true">✦</span>
          <span>SHAMS / HUMANITY</span>
        </a>
        <nav className="desktopNav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#lineup">Artists</a>
          <a href="#info">Info</a>
          <a href="#tickets">Tickets</a>
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
        >
          <span>{menuExpanded ? "Close" : "Menu"}</span>
          <span className="menuIcon" aria-hidden="true">{menuExpanded ? "×" : "＋"}</span>
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
            <a onClick={closeMenu} href="#about">About <span>01</span></a>
            <a onClick={closeMenu} href="#lineup">Artists <span>02</span></a>
            <a onClick={closeMenu} href="#info">Event info <span>03</span></a>
            <a onClick={closeMenu} href="#tickets">Tickets <span>04</span></a>
          </nav>
          <p>{event.city} · {event.date}</p>
        </div>
      )}
    </>
  );
}
