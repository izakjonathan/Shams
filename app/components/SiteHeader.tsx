"use client";

import { useEffect, useState } from "react";
import { event } from "../lib/content";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menuIcon" aria-hidden="true">{menuOpen ? "×" : "＋"}</span>
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`mobileMenu ${menuOpen ? "isOpen" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav>
          <a onClick={closeMenu} href="#about">About <span>01</span></a>
          <a onClick={closeMenu} href="#lineup">Artists <span>02</span></a>
          <a onClick={closeMenu} href="#info">Event info <span>03</span></a>
          <a onClick={closeMenu} href="#tickets">Tickets <span>04</span></a>
        </nav>
        <p>{event.city} · {event.date}</p>
      </div>
    </>
  );
}
