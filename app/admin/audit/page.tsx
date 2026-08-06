import { requireAdmin } from "../lib/auth";
import { listAuditEntries } from "../lib/content-admin";
import { isDatabaseConfigured } from "../../db/client";

export default async function AuditPage() {
  await requireAdmin();
  const configured = isDatabaseConfigured();
  const entries = configured ? await listAuditEntries(150) : [];
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">GOVERNANCE</p><h1>Audit log</h1></div><span className={`adminSource adminSource--${configured ? "database" : "local"}`}>{configured ? "database" : "not connected"}</span></header>
    {!configured && <p className="adminNotice">Connect DATABASE_URL to view persisted content history.</p>}
    {configured && entries.length === 0 && <p className="adminNotice">No audit entries have been recorded yet.</p>}
    {entries.length > 0 && <div className="adminAuditList">{entries.map((entry) => <article key={entry.id} className="adminAuditEntry"><div><strong>{entry.action}</strong><span>{entry.recordType} · {entry.recordId}</span></div><div><span>{entry.actor}</span><time dateTime={entry.createdAt.toISOString()}>{entry.createdAt.toLocaleString("en-GB")}</time></div></article>)}</div>}
  </>;
}
