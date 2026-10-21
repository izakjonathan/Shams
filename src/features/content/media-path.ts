export const MEDIA_PLACEHOLDER = "/images/media-unavailable.svg";
/** Only approved bundled media, legacy upload paths, and Shams Vercel Blob URLs. */
export function isLocalMedia(value: unknown): boolean {
  const src = typeof value === "string" ? value : value && typeof value === "object" && "src" in value ? value.src : undefined;
  if (typeof src !== "string") return false;
  const path = src.trim();
  if (path === MEDIA_PLACEHOLDER) return true;
  // Public Vercel Blob assets: allow only our image namespace on Vercel's CDN.
  // Never accept arbitrary external image URLs or credentials/query parameters.
  if (path.startsWith("https://")) {
    try {
      const url = new URL(path);
      return /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname)
        && !url.username && !url.password && !url.search && !url.hash
        && /^\/shams\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:-[a-zA-Z0-9]+)?\.(?:jpg|jpeg|png|webp|avif)$/i.test(url.pathname);
    } catch { return false; }
  }
  if (/^\/api\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(path)) return true;
  return /^\/(?:images|_next\/static\/media)\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif)$/i.test(path) && !path.includes("..") && !path.includes("//");
}
/** Public compatibility: editor media, the same record's approved asset, then a neutral placeholder. */
export function publicImageOrBaseline(current: unknown, baseline: unknown): unknown {
  if (isLocalMedia(current)) return current;
  if (isLocalMedia(baseline)) return baseline;
  return MEDIA_PLACEHOLDER;
}
