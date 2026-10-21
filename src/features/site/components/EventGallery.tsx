"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../../content";

const SLIDE_INTERVAL_MS = 4800;

// Geometric icons avoid the font-baseline offsets of ←, → and Ⅱ on iOS.
function GalleryIcon({ kind }: { kind: "previous" | "next" | "pause" | "play" }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    {kind === "previous" && <><path d="M20 12H4" /><path d="m11 5-7 7 7 7" /></>}
    {kind === "next" && <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>}
    {kind === "pause" && <><path d="M9 5v14" /><path d="M15 5v14" /></>}
    {kind === "play" && <path d="m8 5 10 7-10 7z" fill="currentColor" stroke="none" />}
  </svg>;
}

// A stable record ID is not a stable image: an editor can replace its media.
function mediaKey(image: GalleryImage): string {
  return typeof image.image === "string" ? image.image : image.image.src;
}

export function EventGallery({ images, editing = false }: { images: readonly GalleryImage[]; editing?: boolean }) {
  const failedImages = useRef(new Set<string>());
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const currentIndex = activeIndex % Math.max(1, images.length);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  // Advance on a clock, not on Next/Image onLoad events. In particular,
  // opacity-hidden slides can be deferred by browsers even when marked eager,
  // leaving a readiness-gated slideshow stuck on the first image.
  // Reduced-motion users get an instant change (see gallery.css), not a fade.
  useEffect(() => {
    if (paused || !pageVisible || images.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        for (let step = 1; step < images.length; step++) {
          const next = (current + step) % images.length;
          if (!failedImages.current.has(mediaKey(images[next]))) return next;
        }
        return current;
      });
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [images, paused, pageVisible]);

  if (!images.length) return null;
  const goTo = (direction: number) => {
    setActiveIndex((current) => {
      for (let step = 1; step < images.length; step++) {
        const next = (current + direction * step + images.length * 2) % images.length;
        if (!failedImages.current.has(mediaKey(images[next]))) return next;
      }
      return current;
    });
  };
  // Only the outgoing, active and incoming slides need decoded image layers.
  const liveIndices = new Set([
    (currentIndex + images.length - 1) % images.length,
    currentIndex,
    (currentIndex + 1) % images.length,
  ]);

  return (
    <section
      className="eventGallery"
      id="gallery"
      aria-label="Event atmosphere gallery"
      aria-roledescription="carousel"
    >
      <div className="eventGallerySlides" aria-hidden="true">
        {images.map((item, index) => liveIndices.has(index) ? (
          <div className={`eventGallerySlide${index === currentIndex ? " isActive" : ""}`} key={item.id}>
            <Image
              src={item.image}
              alt=""
              fill
              sizes="100vw"
              // Preserve original uploaded pixels: Next's default lossy re-encode
              // noticeably softens photographs already compressed by the camera.
              // Bundled WebP images are also served at source quality.
              unoptimized
              // Adjacent slides have opacity:0. Lazy loading can defer them forever
              // in Safari, leaving the carousel unable to advance.
              loading="eager"
              onLoad={() => { failedImages.current.delete(mediaKey(item)); }}
              onError={() => {
                failedImages.current.add(mediaKey(item));
                // Do not leave a broken active image visible until the next tick.
                if (index === currentIndex) goTo(1);
              }}
            />
          </div>
        ) : null)}
      </div>
      {editing && images[currentIndex] && <Link className="inlineEdit galleryEdit" href={`/admin/gallery?edit=${encodeURIComponent(images[currentIndex].id)}#record-editor`}>Edit current image</Link>}
      <h2 className="eventGalleryTitle"><span data-lower-reveal>Shams</span></h2>
      <div className="galleryControls">
        <span className="galleryCount" aria-live="off">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        {images.length > 1 && <div className="galleryButtons">
          <button type="button" onClick={() => goTo(-1)} aria-label="Previous gallery image"><GalleryIcon kind="previous" /></button>
          <button type="button" onClick={() => goTo(1)} aria-label="Next gallery image"><GalleryIcon kind="next" /></button>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume gallery slideshow" : "Pause gallery slideshow"} aria-pressed={paused}><GalleryIcon kind={paused ? "play" : "pause"} /></button>
        </div>}
      </div>
    </section>
  );
}
