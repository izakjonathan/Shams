"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../../content";
import { prefersReducedMotion } from "../../../lib/motion";

const SLIDE_INTERVAL_MS = 4800;

export function EventGallery({ images, editing = false }: { images: readonly GalleryImage[]; editing?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const loadedImages = useRef(new Set<string>());
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const currentIndex = activeIndex % Math.max(1, images.length);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    query.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      query.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

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
    if (paused || hoverPaused || reducedMotion || !pageVisible || !isVisible || images.length < 2 || prefersReducedMotion()) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % images.length;
        // Retain the current photograph until the incoming image has decoded.
        return loadedImages.current.has(images[next].id) ? next : current;
      });
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [images, isVisible, paused, hoverPaused, reducedMotion, pageVisible]);

  if (!images.length) return null;
  // Only the outgoing, active and incoming slides need decoded image layers.
  const liveIndices = new Set([
    (currentIndex + images.length - 1) % images.length,
    currentIndex,
    (currentIndex + 1) % images.length,
  ]);

  return (
    <section
      ref={sectionRef}
      className="eventGallery"
      id="gallery"
      aria-label="Event atmosphere gallery"
      aria-roledescription="carousel"
      onFocusCapture={(event) => { if (!(event.target as Element).closest(".galleryControl")) setPaused(true); }}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHoverPaused(true); }}
      onPointerLeave={() => setHoverPaused(false)}
    >
      <div className="eventGallerySlides" aria-hidden="true">
        {images.map((item, index) => liveIndices.has(index) ? (
          <div className={`eventGallerySlide${index === currentIndex ? " isActive" : ""}`} key={item.id}>
            <Image
              src={item.image}
              alt=""
              fill
              sizes="100vw"
              loading="lazy"
              onLoad={() => { loadedImages.current.add(item.id); }}
            />
          </div>
        ) : null)}
      </div>
      {editing && images[currentIndex] && <Link className="inlineEdit galleryEdit" href={`/admin/gallery?edit=${encodeURIComponent(images[currentIndex].id)}#record-editor`}>Edit current image</Link>}
      <h2 className="eventGalleryTitle"><span data-lower-reveal>Shams</span></h2>
      <span className="galleryCount" aria-hidden="true">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
      {images.length > 1 && <button type="button" className="galleryControl" disabled={reducedMotion} aria-pressed={paused || reducedMotion} onClick={() => setPaused((value) => !value)}>{reducedMotion ? "Gallery paused" : paused ? "Resume gallery" : "Pause gallery"}</button>}
    </section>
  );
}
