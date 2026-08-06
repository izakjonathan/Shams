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
  const raw = String(formData.get("data") ?? "{}");
  if (!id || !Number.isFinite(sortOrder)) throw new Error("Invalid record metadata.");
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Structured JSON must be an object.");
  const prepared: Record<string, unknown> = { ...(parsed as Record<string, unknown>), id, status };
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
