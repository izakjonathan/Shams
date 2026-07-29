"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "../lib/auth";
import { saveAdminRecord, seedDatabase, type AdminContentType } from "../lib/content-admin";

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
  const status = String(formData.get("status") ?? "draft");
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const raw = String(formData.get("data") ?? "{}");
  if (!id || !Number.isFinite(sortOrder)) throw new Error("Invalid record metadata.");
  const data = JSON.parse(raw) as Record<string, unknown>;
  if (data.id && data.id !== id) throw new Error("JSON id must match the record id.");
  data.id = id;
  data.status = status;
  if ("sortOrder" in data || type !== "page") data.sortOrder = sortOrder;
  if (slug) data.slug = slug;
  await saveAdminRecord(actor, { id, type, slug, status, sortOrder, data });
  const route = type === "artist" ? "artists" : type === "faq" ? "faqs" : type === "page" ? "pages" : type;
  revalidatePath(`/admin/${route}`);
  redirect(`/admin/${route}?saved=1`);
}
