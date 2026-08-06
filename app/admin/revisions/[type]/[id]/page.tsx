import Link from "next/link";
import { notFound } from "next/navigation";
import { restoreRevisionAction } from "../../../actions/content";
import { requireAdmin } from "../../../lib/auth";
import { adminRouteForType } from "../../../lib/routes";
import { getAdminRecord, listRecordRevisions, type AdminContentType } from "../../../lib/content-admin";

export const runtime = "nodejs";

const TYPES = new Set<AdminContentType>(["artist", "gallery", "programme", "ticket", "faq", "page"]);

function snapshotTitle(data: Record<string, unknown>, fallback: string) {
  for (const key of ["name", "alt", "label", "type", "question", "title"] as const) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

export default async function RecordRevisionsPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  await requireAdmin();
  const resolved = await params;
  const type = resolved.type as AdminContentType;
  if (!TYPES.has(type)) notFound();
  const id = decodeURIComponent(resolved.id);
  const record = await getAdminRecord(type, id);
  if (!record) notFound();
  const revisions = await listRecordRevisions(type, id, 75);
  const route = adminRouteForType(type);
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">REVISION HISTORY</p><h1>{snapshotTitle(record.data, record.id)}</h1></div><Link className="adminBackLink" href={`/admin/${route}?edit=${encodeURIComponent(record.id)}`}>Back to editor</Link></header>
    <div className="adminPreviewMeta"><span className={`adminStatus adminStatus--${record.status}`}>{record.status}</span><span>Current update: {record.updatedAt ? new Date(record.updatedAt).toLocaleString("en-GB") : "local preview"}</span></div>
    {revisions.length === 0 && <p className="adminNotice">No previous revisions have been captured for this record.</p>}
    {revisions.length > 0 && <div className="adminRevisionTimeline">{revisions.map((revision, index) => <article className="adminRevisionCard" key={revision.id}>
      <div className="adminRevisionCardHeader"><div><p className="adminEyebrow">REVISION {String(revisions.length - index).padStart(2, "0")}</p><h2>{revision.reason}</h2></div><div><span>{revision.actor}</span><time dateTime={revision.createdAt}>{new Date(revision.createdAt).toLocaleString("en-GB")}</time></div></div>
      <dl className="adminRevisionMeta"><div><dt>Status</dt><dd>{revision.snapshot.status}</dd></div><div><dt>Slug</dt><dd>{revision.snapshot.slug ?? "—"}</dd></div><div><dt>Sort order</dt><dd>{revision.snapshot.sortOrder}</dd></div></dl>
      <details className="adminAdvanced"><summary>Inspect revision data</summary><pre>{JSON.stringify(revision.snapshot.data, null, 2)}</pre></details>
      <form action={restoreRevisionAction} className="adminRestoreForm"><input type="hidden" name="revisionId" value={revision.id} /><input type="hidden" name="expectedUpdatedAt" value={record.updatedAt ?? ""} /><button className="adminDangerButton" type="submit">Restore this revision</button><small>Restoring first preserves the current state as a new revision.</small></form>
    </article>)}</div>}
  </>;
}
