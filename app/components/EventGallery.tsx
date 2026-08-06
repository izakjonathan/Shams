"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../content";
import { prefersReducedMotion } from "../lib/motion";

const SLIDE_INTERVAL_MS = 3600;

export function EventGallery({ images }: { images: readonly GalleryImage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || images.length < 2 || prefersReducedMotion()) return;

    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [images.length, isVisible]);

  if (images.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="eventGallery"
      id="gallery"
      aria-label="Event atmosphere gallery"
      aria-roledescription="carousel"
    >
      <div className="eventGallerySlides" aria-hidden="true">
        {images.map((item, index) => (
          <div
            className={`eventGallerySlide${index === activeIndex ? " isActive" : ""}`}
            key={item.id}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="100vw"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      <h2 className="eventGalleryTitle">Shams</h2>
    </section>
  );
}
