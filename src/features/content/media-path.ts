export const MEDIA_PLACEHOLDER = "/images/media-unavailable.svg";
/** Only bundled raster assets and the one trusted neutral SVG placeholder are supported. */
export function isLocalMedia(value: unknown): boolean {
  const src = typeof value === "string" ? value : value && typeof value === "object" && "src" in value ? value.src : undefined;
  if (typeof src !== "string") return false;
  const path = src.trim();
  if (path === MEDIA_PLACEHOLDER) return true;
  if (/^\/api\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path)) return true;
  return /^\/(?:images|_next\/static\/media)\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif)$/i.test(path) && !path.includes("..") && !path.includes("//");
}
/** Public compatibility: editor media, the same record's approved asset, then a neutral placeholder. */
export function publicImageOrBaseline(current: unknown, baseline: unknown): unknown {
  if (isLocalMedia(current)) return current;
  if (isLocalMedia(baseline)) return baseline;
  return MEDIA_PLACEHOLDER;
}
