"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { requireAdmin } from "../server/auth";
import { getAdminRecord, restoreAdminRevision, saveAdminRecord, seedDatabase, type AdminContentType } from "../server/content-admin";
import { adminRouteForType } from "../server/routes";
import { parseContentStatus, validateAdminRecord } from "../../content/admin-validation";
import { CONTENT_TAGS } from "../../content/cache-tags";

const TYPES = new Set<AdminContentType>(["artist", "gallery", "programme", "ticket", "faq", "page"]);

export async function seedDatabaseAction() {
  const actor = await requireAdmin();
  await seedDatabase(actor);
  for (const tag of Object.values(CONTENT_TAGS)) updateTag(tag);
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
  if (type === "gallery") return { ...original, image: String(formData.get("image") ?? "").trim(), alt: String(formData.get("alt") ?? "").trim() };
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
  if (!id || id.length > 160 || !Number.isInteger(sortOrder) || sortOrder < -2147483648 || sortOrder > 2147483647) throw new Error("Invalid record metadata.");
  const current = await getAdminRecord(type, id);
  if (!current) throw new Error("Record not found. Reload the content list.");
  const original = current.data;
  const prepared: Record<string, unknown> = { ...structuredData(type, formData, original as Record<string, unknown>), id, status };
  if ("sortOrder" in prepared || type !== "page") prepared.sortOrder = sortOrder;
  if (slug) prepared.slug = slug;
  const data = validateAdminRecord(prepared, { id, type, slug, status, sortOrder });
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "").trim() || null;
  await saveAdminRecord(actor, { id, type, slug, status, sortOrder, data, updatedAt: expectedUpdatedAt }, expectedUpdatedAt);
  const route = adminRouteForType(type);
  revalidatePath(`/admin/${route}`);
  updateTag(CONTENT_TAGS[type]);
  redirect(`/admin/${route}?saved=1`);
}

export async function restoreRevisionAction(formData: FormData) {
  const actor = await requireAdmin();
  const revisionId = String(formData.get("revisionId") ?? "").trim();
  const expectedUpdatedAt = String(formData.get("expectedUpdatedAt") ?? "").trim() || null;
  if (!revisionId) throw new Error("Revision ID is required.");
  const restored = await restoreAdminRevision(actor, revisionId, expectedUpdatedAt);
  const route = adminRouteForType(restored.type);
  revalidatePath(`/admin/${route}`);
  revalidatePath(`/admin/revisions/${restored.type}/${encodeURIComponent(restored.id)}`);
  updateTag(CONTENT_TAGS[restored.type]);
  redirect(`/admin/${route}?edit=${encodeURIComponent(restored.id)}&restored=1`);
}

function formError(error: unknown): { error: string } {
  if (error instanceof Error && (error.message.startsWith("[admin content]") || /^(This record changed|A stable ID|The record no longer|The current record|Content writes are disabled|Record not found|Revision not found|Invalid record|Original record|Page sections|Contact routes|Organizer)/.test(error.message))) return { error: error.message };
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  const cause = error instanceof Error ? error.cause : undefined;
  const causeCode = cause && typeof cause === "object" && "code" in cause ? cause.code : undefined;
  if (code === "23505" || causeCode === "23505") return { error: "This slug or record ID is already used. Choose a unique value and try again." };
  console.error("[admin content] Saving failed. Check database availability and migrations.");
  return { error: "The change could not be saved. Your input is still here. Check the fields and try again, or contact the site administrator." };
}
export async function saveRecordFormAction(_state: { error: string }, formData: FormData): Promise<{ error: string }> {
  try { await saveRecordAction(formData); return { error: "" }; }
  catch (error) { unstable_rethrow(error); return formError(error); }
}
export async function restoreRevisionFormAction(_state: { error: string }, formData: FormData): Promise<{ error: string }> {
  try { await restoreRevisionAction(formData); return { error: "" }; }
  catch (error) { unstable_rethrow(error); return formError(error); }
}
