import Link from "next/link";
import { seedDatabaseAction } from "./actions/content";
import { requireAdmin } from "./lib/auth";
import { isDatabaseConfigured } from "../db/client";
import { localAdminRecords } from "./lib/content-admin";

export default async function AdminOverview() {
  await requireAdmin();
  const database = isDatabaseConfigured();
  const groups = [
    ["Artists", "artist", "/admin/artists"], ["Programme", "programme", "/admin/programme"], ["Tickets", "ticket", "/admin/tickets"], ["FAQs", "faq", "/admin/faqs"], ["Pages", "page", "/admin/pages"],
  ] as const;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">OVERVIEW</p><h1>Content studio</h1></div><span className={`adminSource adminSource--${database ? "database" : "local"}`}>{database ? "Database connected" : "Local preview"}</span></header>
    {!database && <div className="adminNotice"><strong>Database not connected.</strong><p>The admin is showing the canonical local content in read-only mode. Add DATABASE_URL, run the migration, then seed the database.</p></div>}
    {database && <form action={seedDatabaseAction} className="adminSeed"><p>Seed or refresh database records from the v2.1.3 local baseline.</p><button type="submit">Seed database</button></form>}
    <div className="adminCards">{groups.map(([label, type, href]) => <Link href={href} key={type}><span>{localAdminRecords(type).length}</span><h2>{label}</h2><p>View, edit, order and publish records.</p></Link>)}</div>
    <section className="adminRoadmap"><h2>Foundation included</h2><p>Protected admin sessions, PostgreSQL schema, database seeding, JSON record editing, audit logs, draft/published states and local-data fallback.</p></section>
  </>;
}
