"use client";

import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { event } from "../lib/content";

type MenuPhase = "closed" | "opening" | "open" | "closing";

const MENU_EXIT_FALLBACK_MS = 650;

export function SiteHeader() {
  const [menuPhase, setMenuPhase] = useState<MenuPhase>("closed");
  const enterFrameRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const menuMounted = menuPhase !== "closed";
  const menuOpen = menuPhase === "opening" || menuPhase === "open";

  useEffect(() => {
    if (menuPhase !== "opening") return;

    // Mount the panel in its translated closed position first, then animate it
    // into view on the next painted frame. This avoids an opening flash.
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
    document.body.style.overflow = menuMounted ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuMounted]);

  useEffect(() => {
    if (menuPhase !== "closing") return;

    // `transitionend` is the primary close path; the timeout covers interrupted
    // transitions and reduced-motion environments.
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

  const openMenu = () => {
    if (menuPhase === "closed") setMenuPhase("opening");
  };

  const closeMenu = () => {
    if (menuPhase === "opening" || menuPhase === "open") {
      setMenuPhase("closing");
    }
  };

  const toggleMenu = () => {
    if (menuPhase === "closed") {
      openMenu();
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
          className="menuButton"
          type="button"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menuIcon" aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
        </button>
      </header>

      {menuMounted && (
        <div
          id="mobile-menu"
          className={`mobileMenu${menuOpen ? " isOpen" : ""}`}
          aria-hidden={!menuOpen}
          onTransitionEnd={handleMenuTransitionEnd}
        >
          <nav>
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
