import { isContentWritable } from "../../features/admin/server/write-policy";
import Link from "next/link";
import { seedDatabaseAction } from "../../features/admin/actions/content";
import { requireAdmin } from "../../features/admin/server/auth";
import { isDatabaseConfigured } from "../../db/client";
import { adminRecordCounts } from "../../features/admin/server/content-admin";

export default async function AdminOverview() {
  await requireAdmin();
  const counts = await adminRecordCounts();
  const database = isDatabaseConfigured();
  const groups = [
    ["Artists", "artist", "/admin/artists"], ["Gallery", "gallery", "/admin/gallery"], ["Programme", "programme", "/admin/programme"], ["Tickets", "ticket", "/admin/tickets"], ["FAQs", "faq", "/admin/faqs"], ["Pages", "page", "/admin/pages"],
  ] as const;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">OVERVIEW</p><h1>Content studio</h1></div><span className={`adminSource adminSource--${database ? "database" : "local"}`}>{database ? "Database configured" : "Local preview"}</span></header>
    {!database && <div className="adminNotice"><strong>Database not connected.</strong><p>The admin is showing the canonical local content in read-only mode. Add DATABASE_URL, run the migration, then seed the database.</p></div>}
    {database && <form action={seedDatabaseAction} className="adminSeed"><p>Add missing baseline records. Existing edits and publication states are preserved.</p><button type="submit" disabled={!isContentWritable()}>Seed database</button></form>}
    <div className="adminCards">{groups.map(([label, type, href]) => <Link href={href} key={type}><span>{counts[type] ?? 0}</span><h2>{label}</h2><p>View, edit, order and publish records.</p></Link>)}</div>
    <section className="adminRoadmap"><h2>Editing workflow</h2><p>Protected sessions, structured content forms, media metadata checks, PostgreSQL publishing, previews, audit logs, draft states and local-data fallback.</p></section>
  </>;
}
