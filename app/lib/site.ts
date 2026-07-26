const fallbackSiteUrl = "https://shamsforhumanity.com";

export function safeExternalUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizeSiteUrl(value: string | undefined): string {
  const normalized = safeExternalUrl(value) ?? fallbackSiteUrl;
  const url = new URL(normalized);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
