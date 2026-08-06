import type { AdminContentType } from "./content-admin";

export function adminRouteForType(type: AdminContentType): string {
  if (type === "artist") return "artists";
  if (type === "faq") return "faqs";
  if (type === "page") return "pages";
  return type;
}
