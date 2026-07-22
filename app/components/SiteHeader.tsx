"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { event } from "../lib/content";

const MENU_EXIT_FALLBACK_MS = 620;
const DARK_SURFACE_SELECTOR = ".manifesto, .tickets, footer";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [isOnDarkSurface, setIsOnDarkSurface] = useState(false);
  const openFrame = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const darkSurfaceEls = useRef<HTMLElement[]>([]);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    darkSurfaceEls.current = Array.from(document.querySelectorAll<HTMLElement>(DARK_SURFACE_SELECTOR));
  }, []);

  const updateHeaderSurface = useCallback(() => {
    if (menuMounted) return;
    // Compare against cached section rects instead of document.elementsFromPoint,
    // which forces a full hit-test of the render tree on every scroll frame and
    // was a source of scroll jank.
    const headerRect = headerRef.current?.getBoundingClientRect();
    const sampleY = headerRect
      ? Math.max(0, Math.min(window.innerHeight - 1, headerRect.bottom - 8))
      : 36;
    const isDark = darkSurfaceEls.current.some((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top <= sampleY && rect.bottom >= sampleY;
    });
    setIsOnDarkSurface(isDark);
  }, [menuMounted]);

  const openMenu = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMenuMounted(true);
    openFrame.current = window.requestAnimationFrame(() => {
      openFrame.current = window.requestAnimationFrame(() => setMenuOpen(true));
    });
  };

  const finishClosing = () => {
    setMenuMounted(false);
    window.requestAnimationFrame(() => {
      updateHeaderSurface();
      window.dispatchEvent(new Event("shams:viewport-state-change"));
    });
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
    const body = document.body;
    const root = document.documentElement;

    const preventPointerScroll = (event: TouchEvent | WheelEvent) => {
      event.preventDefault();
    };

    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [contenteditable='true']")) return;
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        event.preventDefault();
      }
    };

    if (menuMounted) {
      root.classList.remove("overscrollBottom");
      body.classList.remove("overscrollBottom");
      root.classList.add("menuOpen");
      body.classList.add("menuOpen");
      document.addEventListener("touchmove", preventPointerScroll, { passive: false });
      document.addEventListener("wheel", preventPointerScroll, { passive: false });
      document.addEventListener("keydown", preventKeyboardScroll);
      window.dispatchEvent(new Event("shams:viewport-state-change"));
    } else {
      root.classList.remove("menuOpen");
      body.classList.remove("menuOpen");
      window.requestAnimationFrame(() => {
        updateHeaderSurface();
        window.dispatchEvent(new Event("shams:viewport-state-change"));
      });
    }

    return () => {
      document.removeEventListener("touchmove", preventPointerScroll);
      document.removeEventListener("wheel", preventPointerScroll);
      document.removeEventListener("keydown", preventKeyboardScroll);
      if (!menuMounted) return;
      root.classList.remove("menuOpen");
      body.classList.remove("menuOpen");
    };
  }, [menuMounted, updateHeaderSurface]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame || menuMounted) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateHeaderSurface();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [menuMounted, updateHeaderSurface]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 760px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      setMenuOpen(false);
      setMenuMounted(false);
    };
    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => () => {
    if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  const headerClass = [
    "siteHeader",
    menuMounted ? "isMenuActive" : isOnDarkSurface ? "isOnDarkSurface" : "isOnLightSurface",
  ].join(" ");

  return (
    <>
      <header ref={headerRef} className={headerClass}>
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
            if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
            if (!menuOpen) {
              if (closeTimer.current !== null) {
                window.clearTimeout(closeTimer.current);
                closeTimer.current = null;
              }
              finishClosing();
            }
          }}
        >
          <div className="mobileMenuInner">
            <nav>
              <a onClick={closeMenu} href="#about">About <span>01</span></a>
              <a onClick={closeMenu} href="#lineup">Artists <span>02</span></a>
              <a onClick={closeMenu} href="#info">Event info <span>03</span></a>
              <a onClick={closeMenu} href="#tickets">Tickets <span>04</span></a>
            </nav>
            <p>{event.city} · {event.date}</p>
          </div>
        </div>
      )}
    </>
  );
}
