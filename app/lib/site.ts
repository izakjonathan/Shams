const fallbackSiteUrl = "https://shamsforhumanity.com";

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl
);
