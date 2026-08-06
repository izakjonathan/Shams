"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../lib/auth";
import { saveAdminRecord, seedDatabase, type AdminContentType } from "../lib/content-admin";
import { parseContentStatus, validateAdminRecord } from "../../content/admin-validation";

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
  const status = parseContentStatus(formData.get("status"));
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const raw = String(formData.get("data") ?? "{}");
  if (!id || !Number.isFinite(sortOrder)) throw new Error("Invalid record metadata.");
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Structured JSON must be an object.");
  const prepared: Record<string, unknown> = { ...(parsed as Record<string, unknown>), id, status };
  if ("sortOrder" in prepared || type !== "page") prepared.sortOrder = sortOrder;
  if (slug) prepared.slug = slug;
  const data = validateAdminRecord(prepared, { id, type, slug, status, sortOrder });
  await saveAdminRecord(actor, { id, type, slug, status, sortOrder, data });
  const route = type === "artist" ? "artists" : type === "faq" ? "faqs" : type === "page" ? "pages" : type;
  revalidatePath(`/admin/${route}`);
  redirect(`/admin/${route}?saved=1`);
}
