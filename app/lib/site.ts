const localSiteUrl = "http://localhost:3000";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/**
 * Validate a public HTTP(S) URL used by metadata or external integrations.
 * Production URLs must use HTTPS; plain HTTP is accepted only for local
 * development. Embedded credentials are always rejected.
 */
export function safeExternalUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    const validProtocol = url.protocol === "https:" ||
      (url.protocol === "http:" && isLocalHostname(url.hostname));

    if (!validProtocol || url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function vercelUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  return safeExternalUrl(candidate.includes("://") ? candidate : `https://${candidate}`);
}

function normalizeSiteUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

const configuredSiteUrl = safeExternalUrl(process.env.NEXT_PUBLIC_SITE_URL);
const deploymentSiteUrl =
  vercelUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  vercelUrl(process.env.VERCEL_URL);

/**
 * Canonical origin used by metadata, structured data, robots and sitemap.
 *
 * Priority:
 * 1. Explicit public site URL
 * 2. Current Vercel production/preview URL
 * 3. Local development URL
 */
export const siteUrl = normalizeSiteUrl(
  configuredSiteUrl ?? deploymentSiteUrl ?? localSiteUrl,
);

/**
 * Preview deployments remain noindex by default. Enable indexing explicitly
 * only when the public launch URL is ready.
 */
export const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING?.trim().toLowerCase() === "true";

/** Serialize trusted structured data while preventing a literal closing tag
 * sequence from appearing in the inline script payload. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
