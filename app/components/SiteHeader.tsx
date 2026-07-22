"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { event } from "../lib/content";

const MENU_EXIT_FALLBACK_MS = 620;
const DARK_SURFACE_SELECTOR = ".manifesto, .tickets, footer";

type MenuGeometry = {
  top: number;
  height: number;
};

/**
 * Important iOS Safari constraint:
 * Safari 26 can permanently retint its top chrome when a fixed/sticky
 * element's background changes or when a new fixed overlay is shown.
 * Therefore:
 * - the fixed header background is always transparent and never changes;
 * - the mobile menu is document-positioned (`absolute`), not fixed;
 * - opening/closing the menu never mutates html/body backgrounds or overflow.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [isOnDarkSurface, setIsOnDarkSurface] = useState(false);
  const [menuGeometry, setMenuGeometry] = useState<MenuGeometry>({ top: 0, height: 0 });
  const headerRef = useRef<HTMLElement | null>(null);
  const openFrame = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const updateHeaderSurface = useCallback(() => {
    const sampleY = Math.max(1, Math.min(window.innerHeight - 1, 36));
    const sampleX = Math.max(1, Math.min(window.innerWidth - 1, window.innerWidth / 2));
    const elements = document.elementsFromPoint(sampleX, sampleY);
    setIsOnDarkSurface(elements.some((element) => element.closest(DARK_SURFACE_SELECTOR)));
  }, []);

  const measureMenu = useCallback(() => {
    const viewport = window.visualViewport;
    const viewportTop = window.scrollY + (viewport?.offsetTop ?? 0);
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const headerHeight = window.matchMedia("(min-width: 760px)").matches ? 84 : 72;

    setMenuGeometry({
      top: Math.round(viewportTop + headerHeight),
      height: Math.max(0, Math.ceil(viewportHeight - headerHeight)),
    });
  }, []);

  const openMenu = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    measureMenu();
    setMenuMounted(true);
    openFrame.current = window.requestAnimationFrame(() => {
      openFrame.current = window.requestAnimationFrame(() => setMenuOpen(true));
    });
  };

  const finishClosing = () => {
    setMenuMounted(false);
    window.requestAnimationFrame(updateHeaderSurface);
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
    let frame = 0;

    const positionHeader = () => {
      frame = 0;
      const viewport = window.visualViewport;
      const viewportTop = window.scrollY + (viewport?.offsetTop ?? 0);
      headerRef.current?.style.setProperty(
        "transform",
        `translate3d(0, ${Math.round(viewportTop)}px, 0)`,
      );
    };

    const schedulePosition = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(positionHeader);
    };

    positionHeader();
    window.addEventListener("scroll", schedulePosition, { passive: true });
    window.addEventListener("resize", schedulePosition, { passive: true });
    window.visualViewport?.addEventListener("resize", schedulePosition, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedulePosition, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("resize", schedulePosition);
      window.visualViewport?.removeEventListener("scroll", schedulePosition);
    };
  }, []);

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
    if (!menuMounted) return;

    let frame = 0;
    const scheduleMeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measureMenu();
      });
    };

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleMeasure, { passive: true });
    window.visualViewport?.addEventListener("scroll", scheduleMeasure, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("scroll", scheduleMeasure);
    };
  }, [measureMenu, menuMounted]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 760px)");
    const handleChange = (mediaEvent: MediaQueryListEvent) => {
      if (!mediaEvent.matches) return;
      setMenuOpen(false);
      setMenuMounted(false);
    };
    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    return () => {
      if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current);
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const headerClass = [
    "siteHeader",
    isOnDarkSurface ? "isOnDarkSurface" : "isOnLightSurface",
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
          style={{ top: menuGeometry.top, height: menuGeometry.height }}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          onTouchMove={(event) => event.preventDefault()}
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
