"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../lib/auth";
import { saveAdminRecord, seedDatabase, type AdminContentType } from "../lib/content-admin";
import { adminRouteForType } from "../lib/routes";
import { parseContentStatus, validateAdminRecord } from "../../content/admin-validation";
import { CONTENT_TAGS } from "../../content/cache-tags";

const TYPES = new Set<AdminContentType>(["artist", "programme", "ticket", "faq", "page"]);

export async function seedDatabaseAction() {
  const actor = await requireAdmin();
  await seedDatabase(actor);
  revalidatePath("/admin");
}

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function jsonField(value: FormDataEntryValue | null, label: string): unknown {
  try { return JSON.parse(String(value ?? "")); }
  catch { throw new Error(`${label} must contain valid JSON.`); }
}

function structuredData(type: AdminContentType, formData: FormData, original: Record<string, unknown>): Record<string, unknown> {
  if (type === "artist") return { ...original,
    name: String(formData.get("name") ?? "").trim(), type: String(formData.get("artistType") ?? "").trim(),
    time: String(formData.get("time") ?? "").trim(), stage: String(formData.get("stage") ?? "").trim(),
    origin: String(formData.get("origin") ?? "").trim(), genre: String(formData.get("genre") ?? "").trim(),
    pronouns: String(formData.get("pronouns") ?? "").trim() || undefined,
    shortBio: String(formData.get("shortBio") ?? "").trim(), biography: lines(formData.get("biography")),
    quote: String(formData.get("quote") ?? "").trim(), setDescription: String(formData.get("setDescription") ?? "").trim(),
    highlights: lines(formData.get("highlights")), image: String(formData.get("image") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(), imagePosition: String(formData.get("imagePosition") ?? "").trim() || undefined,
    links: lines(formData.get("links")).map((line) => { const [label, ...href] = line.split("|"); return { label: label.trim(), href: href.join("|").trim() || undefined }; }),
  };
  if (type === "programme") return { ...original, time: String(formData.get("time") ?? "").trim(), label: String(formData.get("label") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), category: String(formData.get("category") ?? "").trim(), stage: String(formData.get("stage") ?? "").trim() };
  if (type === "ticket") return { ...original, type: String(formData.get("ticketType") ?? "").trim(), badge: String(formData.get("badge") ?? "").trim(), description: String(formData.get("description") ?? "").trim(), price: Number(formData.get("price") ?? 0), currency: String(formData.get("currency") ?? "").trim(), availability: String(formData.get("availability") ?? "").trim(), featured: formData.get("featured") === "on", includes: lines(formData.get("includes")) };
  if (type === "faq") return { ...original, question: String(formData.get("question") ?? "").trim(), answer: String(formData.get("answer") ?? "").trim() };
  if ("routes" in original) return { ...original, index: String(formData.get("index") ?? "").trim(), titleLines: lines(formData.get("titleLines")), intro: String(formData.get("intro") ?? "").trim(), routes: jsonField(formData.get("routesJson"), "Contact routes"), organizer: jsonField(formData.get("organizerJson"), "Organizer") };
  return { ...original, index: String(formData.get("index") ?? "").trim(), title: String(formData.get("title") ?? "").trim(), intro: String(formData.get("intro") ?? "").trim(), updated: String(formData.get("updated") ?? "").trim(), sections: jsonField(formData.get("sectionsJson"), "Page sections") };
}

export async function saveRecordAction(formData: FormData) {
  const actor = await requireAdmin();
  const type = String(formData.get("type") ?? "") as AdminContentType;
  if (!TYPES.has(type)) throw new Error("Invalid content type.");
  const id = String(formData.get("id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || null;
  const requestedStatus = parseContentStatus(formData.get("status"));
  const intent = String(formData.get("intent") ?? "save");
  const status = intent === "publish" ? "published" : intent === "draft" ? "draft" : intent === "archive" ? "archived" : requestedStatus;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!id || !Number.isFinite(sortOrder)) throw new Error("Invalid record metadata.");
  const original = jsonField(formData.get("originalData"), "Original record");
  if (!original || typeof original !== "object" || Array.isArray(original)) throw new Error("Original record is invalid.");
  const prepared: Record<string, unknown> = { ...structuredData(type, formData, original as Record<string, unknown>), id, status };
  if ("sortOrder" in prepared || type !== "page") prepared.sortOrder = sortOrder;
  if (slug) prepared.slug = slug;
  const data = validateAdminRecord(prepared, { id, type, slug, status, sortOrder });
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "").trim() || null;
  await saveAdminRecord(actor, { id, type, slug, status, sortOrder, data, updatedAt: expectedUpdatedAt }, expectedUpdatedAt);
  const route = adminRouteForType(type);
  revalidatePath(`/admin/${route}`);
  revalidateTag(CONTENT_TAGS[type], "max");
  redirect(`/admin/${route}?saved=1`);
}
