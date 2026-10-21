"use client";

import Link from "next/link";
import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../../content";

const SLIDE_INTERVAL_MS = 4800;
const IMAGE_WAIT_MS = 3800;

function GalleryIcon({ kind }: { kind: "previous" | "next" | "pause" | "play" }) {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    {kind === "previous" && <><path d="M20 12H4" /><path d="m11 5-7 7 7 7" /></>}
    {kind === "next" && <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>}
    {kind === "pause" && <><path d="M9 5v14" /><path d="M15 5v14" /></>}
    {kind === "play" && <path d="m8 5 10 7-10 7z" fill="currentColor" stroke="none" />}
  </svg>;
}

function mediaKey(image: GalleryImage): string {
  return typeof image.image === "string" ? image.image : image.image.src;
}

/** Use the same responsive Next/Image URLs for preloading and display. */
function imageRequest(image: GalleryImage) {
  const { props } = getImageProps({ src: image.image, alt: "", fill: true, sizes: "100vw", quality: 90 });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes };
}

export function EventGallery({ images, editing = false }: { images: readonly GalleryImage[]; editing?: boolean }) {
  const galleryRef = useRef<HTMLElement>(null);
  const cacheRef = useRef(new Map<string, Promise<boolean>>());
  const failedRef = useRef(new Set<string>());
  const requestRef = useRef(0);
  const generationRef = useRef(0);
  const activeRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [readyKeys, setReadyKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [fallbackKeys, setFallbackKeys] = useState<ReadonlySet<string>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const currentIndex = images.length ? activeIndex % images.length : 0;
  const current = images[currentIndex];
  const currentKey = current ? mediaKey(current) : "";

  // A decoded frame is required before changing the visible slide. A failed or
  // slow frame is skipped after a bounded wait, never painted as an empty slide.
  const preload = useCallback((item: GalleryImage): Promise<boolean> => {
    const key = mediaKey(item);
    if (failedRef.current.has(key)) return Promise.resolve(false);
    const cached = cacheRef.current.get(key);
    if (cached) return cached;
    const generation = generationRef.current;
    const promise = new Promise<boolean>((resolve) => {
      const optimized = imageRequest(item);
      const load = (original: boolean) => {
        const image = new window.Image();
        image.decoding = "async";
        if (!original) {
          image.sizes = optimized.sizes ?? "100vw";
          if (optimized.srcSet) image.srcset = optimized.srcSet;
        }
        image.onload = () => {
          // Some older Safari versions do not support decode().
          const decoded = typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();
          void decoded.then(() => {
            if (generation !== generationRef.current) { resolve(false); return; }
            if (original) setFallbackKeys((previous) => new Set(previous).add(key));
            setReadyKeys((previous) => new Set(previous).add(key));
            resolve(true);
          });
        };
        image.onerror = () => {
          if (generation !== generationRef.current) { resolve(false); return; }
          // Optimizer outage must not hide an otherwise valid uploaded image.
          if (!original && optimized.src !== key) load(true);
          else { failedRef.current.add(key); resolve(false); }
        };
        image.src = original ? key : optimized.src;
      };
      load(false);
    });
    cacheRef.current.set(key, promise);
    return promise;
  }, []);

  const showNext = useCallback(async (direction: number) => {
    if (images.length < 2) return;
    const requestId = ++requestRef.current;
    const start = activeRef.current % images.length;
    for (let step = 1; step < images.length; step++) {
      const index = (start + direction * step % images.length + images.length) % images.length;
      const item = images[index];
      if (failedRef.current.has(mediaKey(item))) continue;
      const result = await Promise.race([
        preload(item),
        new Promise<false>((resolve) => window.setTimeout(() => resolve(false), IMAGE_WAIT_MS)),
      ]);
      if (requestId !== requestRef.current) return;
      if (!result) continue;
      setPreviousIndex(start);
      activeRef.current = index;
      setActiveIndex(index);
      return;
    }
    // No frame ready yet. Retain the current image and try again next cycle.
    if (requestId === requestRef.current) setAttempt((value) => value + 1);
  }, [images, preload]);

  useEffect(() => {
    // A replaced record can keep its ID but have a different image URL.
    requestRef.current++;
    generationRef.current++;
    cacheRef.current.clear();
    failedRef.current.clear();
    setReadyKeys(new Set());
    setFallbackKeys(new Set());
    activeRef.current = 0;
    setActiveIndex(0);
    setPreviousIndex(null);
    if (images[0]) void preload(images[0]).then((ok) => { if (!ok) void showNext(1); });
  }, [images, preload, showNext]);

  useEffect(() => {
    if (previousIndex === null) return;
    const timeout = window.setTimeout(() => setPreviousIndex(null), 680);
    return () => window.clearTimeout(timeout);
  }, [previousIndex, activeIndex]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setPaused(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => motion.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    const element = galleryRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    if (!visible || !pageVisible || !images.length) return;
    // Only the next frame is warmed, never three full-size originals at once.
    const next = images[(currentIndex + 1) % images.length];
    if (next && images.length > 1) void preload(next);
  }, [visible, pageVisible, images, currentIndex, preload]);

  useEffect(() => {
    if (paused || !visible || !pageVisible || images.length < 2 || !readyKeys.has(currentKey)) return;
    const timeout = window.setTimeout(() => { void showNext(1); }, SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(timeout);
  }, [paused, visible, pageVisible, images.length, currentKey, readyKeys, showNext, attempt]);

  // Cancel in-flight handoffs if the gallery leaves view or motion is disabled.
  useEffect(() => {
    if (!visible || !pageVisible || paused) requestRef.current++;
  }, [visible, pageVisible, paused]);

  // Ignore late decoded-image callbacks after unmount.
  useEffect(() => () => { requestRef.current++; generationRef.current++; }, []);

  if (!images.length) return null;
  const currentReady = readyKeys.has(currentKey);
  const previous = previousIndex !== null ? images[previousIndex] : null;
  const previousKey = previous ? mediaKey(previous) : "";

  return (
    <section ref={galleryRef} className="eventGallery" id="gallery" aria-label="Event atmosphere gallery" aria-roledescription="carousel">
      <div className="eventGallerySlides" aria-hidden="true">
        {previous && previousKey !== currentKey && readyKeys.has(previousKey) && <div className="eventGallerySlide isOutgoing" key={previousKey}>
          <Image src={previous.image} alt="" fill sizes="100vw" quality={90} unoptimized={fallbackKeys.has(previousKey)} />
        </div>}
        {currentReady && <div className="eventGallerySlide isActive" key={currentKey}>
          <Image src={current.image} alt="" fill sizes="100vw" quality={90} unoptimized={fallbackKeys.has(currentKey)} priority={currentIndex === 0} />
        </div>}
      </div>
      {editing && current && <Link className="inlineEdit galleryEdit" href={`/admin/gallery?edit=${encodeURIComponent(current.id)}#record-editor`}>Edit current image</Link>}
      <h2 className="eventGalleryTitle"><span data-lower-reveal>Shams</span></h2>
      <div className="galleryControls">
        <span className="galleryCount" aria-live="off">{String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        {images.length > 1 && <div className="galleryButtons">
          <button type="button" onClick={() => { void showNext(-1); }} aria-label="Previous gallery image"><GalleryIcon kind="previous" /></button>
          <button type="button" onClick={() => { void showNext(1); }} aria-label="Next gallery image"><GalleryIcon kind="next" /></button>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume gallery slideshow" : "Pause gallery slideshow"} aria-pressed={paused}><GalleryIcon kind={paused ? "play" : "pause"} /></button>
        </div>}
      </div>
    </section>
  );
}
