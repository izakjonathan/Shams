"use client";

import { useEffect, useRef, useState } from "react";
import { event } from "../lib/content";

const MENU_EXIT_FALLBACK_MS = 650;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const openFrame = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const notifyViewportStateChanged = () => {
    window.dispatchEvent(new Event("shams:viewport-state-change"));
  };

  const openMenu = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setMenuMounted(true);
    openFrame.current = window.requestAnimationFrame(() => {
      openFrame.current = window.requestAnimationFrame(() => {
        setMenuOpen(true);
      });
    });
  };

  const finishClosing = () => {
    setMenuMounted(false);
    notifyViewportStateChanged();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(finishClosing, MENU_EXIT_FALLBACK_MS);
  };

  const toggleMenu = () => {
    if (menuOpen || menuMounted) closeMenu();
    else openMenu();
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let secondFrame: number | null = null;

    root.classList.toggle("menuScrollLocked", menuMounted);
    body.classList.toggle("menuScrollLocked", menuMounted);

    // Recalculate the Safari edge canvas both immediately and after the
    // browser has restored normal document metrics on lock/unlock.
    notifyViewportStateChanged();
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(notifyViewportStateChanged);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) window.cancelAnimationFrame(secondFrame);
    };
  }, [menuMounted]);

  // Close the mobile menu if the viewport is resized past the desktop
  // breakpoint while it is open (for example, after rotating a tablet).
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 760px)");
    const handleChange = (mediaEvent: MediaQueryListEvent) => {
      if (mediaEvent.matches) {
        setMenuOpen(false);
        setMenuMounted(false);
      }
    };
    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    return () => {
      if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current);
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
      document.documentElement.classList.remove("menuScrollLocked");
      document.body.classList.remove("menuScrollLocked");
    };
  }, []);

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
          className={`mobileMenu ${menuOpen ? "isOpen" : "isClosing"}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
            if (!menuOpen) {
              if (closeTimer.current !== null) {
                window.clearTimeout(closeTimer.current);
                closeTimer.current = null;
              }
              finishClosing();
            }
          }}
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
