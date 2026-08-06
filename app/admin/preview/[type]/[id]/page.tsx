import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "../../../lib/auth";
import { getAdminRecord, type AdminContentType } from "../../../lib/content-admin";

const TYPES = new Set<AdminContentType>(["artist", "programme", "ticket", "faq", "page"]);

function publicPath(type: AdminContentType, record: Awaited<ReturnType<typeof getAdminRecord>>) {
  if (!record) return null;
  if (type === "artist" && record.slug) return `/artists/${record.slug}`;
  if (type === "page") {
    if (record.slug && ["privacy", "terms", "accessibility", "contact"].includes(record.slug)) return `/${record.slug}`;
    if ("routes" in record.data) return "/contact";
  }
  return "/";
}

export default async function AdminRecordPreview({ params }: { params: Promise<{ type: string; id: string }> }) {
  await requireAdmin();
  const { type: rawType, id } = await params;
  const type = rawType as AdminContentType;
  if (!TYPES.has(type)) notFound();
  const record = await getAdminRecord(type, id);
  const path = publicPath(type, record);
  if (!path) notFound();
  redirect(`/api/preview?path=${encodeURIComponent(path)}`);
}
