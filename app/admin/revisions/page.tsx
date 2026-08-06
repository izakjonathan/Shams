import Link from "next/link";
import { requireAdmin } from "../lib/auth";
import { isDatabaseConfigured } from "../../db/client";
import { listRecentRevisions } from "../lib/content-admin";

export const runtime = "nodejs";

export default async function RevisionsPage() {
  await requireAdmin();
  const configured = isDatabaseConfigured();
  const revisions = configured ? await listRecentRevisions(150) : [];
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">GOVERNANCE</p><h1>Revisions</h1></div><span className={`adminSource adminSource--${configured ? "database" : "local"}`}>{configured ? "database" : "not connected"}</span></header>
    {!configured && <p className="adminNotice">Connect DATABASE_URL and run the latest migration to use revision history.</p>}
    {configured && revisions.length === 0 && <p className="adminNotice">No revisions exist yet. The previous state is captured whenever a record is changed.</p>}
    {revisions.length > 0 && <div className="adminRevisionList">{revisions.map((revision) => <Link className="adminRevisionRow" href={`/admin/revisions/${revision.recordType}/${encodeURIComponent(revision.recordId)}`} key={revision.id}><div><strong>{revision.recordId}</strong><span>{revision.recordType} · {revision.reason}</span></div><div><span>{revision.actor}</span><time dateTime={revision.createdAt}>{new Date(revision.createdAt).toLocaleString("en-GB")}</time></div></Link>)}</div>}
  </>;
}
