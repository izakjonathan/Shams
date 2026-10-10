/** Only same-origin bundled raster assets are supported by the current image/CSP policy. */
export function isLocalMedia(value: unknown): boolean {
  const src = typeof value === "string" ? value : value && typeof value === "object" && "src" in value ? value.src : undefined;
  if (typeof src !== "string") return false;
  const path = src.trim();
  return /^\/(?:images|_next\/static\/media)\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif)$/i.test(path) && !path.includes("..") && !path.includes("//");
}
/** Public compatibility only: retain valid editor media, or use that record's approved baseline asset. */
export function publicImageOrBaseline(current: unknown, baseline: unknown): unknown {
  if (isLocalMedia(current)) return current;
  if (isLocalMedia(baseline)) return baseline;
  throw new Error("The image has no supported local asset or canonical fallback.");
}
