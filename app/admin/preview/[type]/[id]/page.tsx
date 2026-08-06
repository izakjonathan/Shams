import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/auth";
import { getAdminRecord, type AdminContentType } from "../../../lib/content-admin";
import { adminRouteForType } from "../../../lib/routes";

const TYPES = new Set<AdminContentType>(["artist", "programme", "ticket", "faq", "page"]);

function recordTitle(data: Record<string, unknown>, fallback: string) {
  for (const key of ["name", "title", "question", "label", "type"]) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

export default async function AdminRecordPreview({ params }: { params: Promise<{ type: string; id: string }> }) {
  await requireAdmin();
  const { type: rawType, id } = await params;
  const type = rawType as AdminContentType;
  if (!TYPES.has(type)) notFound();
  const record = await getAdminRecord(type, id);
  if (!record) notFound();
  const route = adminRouteForType(type);
  return (
    <article className="adminPreview">
      <header className="adminPageHeader">
        <div><p className="adminEyebrow">PROTECTED PREVIEW</p><h1>{recordTitle(record.data, record.id)}</h1></div>
        <Link className="adminBackLink" href={`/admin/${route}?edit=${encodeURIComponent(record.id)}`}>Back to editor</Link>
      </header>
      <div className="adminPreviewMeta">
        <span className={`adminStatus adminStatus--${record.status}`}>{record.status}</span>
        <span>{record.type}</span><span>{record.slug ?? record.id}</span><span>Order {record.sortOrder}</span>
      </div>
      <section className="adminPreviewCard">
        {Object.entries(record.data).map(([key, value]) => (
          <div className="adminPreviewField" key={key}>
            <strong>{key}</strong>
            {Array.isArray(value) || (value && typeof value === "object")
              ? <pre>{JSON.stringify(value, null, 2)}</pre>
              : <p>{String(value ?? "")}</p>}
          </div>
        ))}
      </section>
    </article>
  );
}
