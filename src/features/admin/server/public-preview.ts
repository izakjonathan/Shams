import type { AdminRecord } from "./content-admin";

export function publicPreviewPath(record: AdminRecord): string {
  if (record.type === "artist" && record.slug) return `/artists/${record.slug}`;
  if (record.type === "programme") return "/#programme";
  if (record.type === "ticket") return "/#tickets";
  if (record.type === "faq") return "/#faq";
  if (record.slug === "contact" || record.id.toLowerCase().includes("contact")) return "/contact";
  if (record.slug) return `/${record.slug}`;
  return "/";
}
