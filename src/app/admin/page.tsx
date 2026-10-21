import { randomUUID } from "node:crypto";
import { AdminAccounts } from "../../features/admin/components/AdminAccounts";
import { requireAdmin, isOwnerIdentity } from "../../features/admin/server/auth";
import { listAdminRecords, localAdminRecords } from "../../features/admin/server/content-admin";
import { isContentWritable } from "../../features/admin/server/write-policy";
import { SimpleCollection } from "../../features/admin/components/SimpleEditor";
import type { AdminContentType } from "../../features/admin/types";
const sections = [["artist", "Artists"], ["gallery", "Gallery"], ["programme", "Programme"], ["ticket", "Tickets"], ["faq", "FAQs"], ["page", "Contact & information"]] as const;
export default async function AdminOverview({ searchParams }: { searchParams: Promise<{ saved?: string; section?: string; adminSaved?: string }> }) {
  const identity = await requireAdmin();
  const params = await searchParams;
  const collections = await Promise.all(sections.map(async ([type, label]) => ({ type, label, ...await listAdminRecords(type) })));
  const writable = isContentWritable();
  return <div className="simpleStudio">
    <header className="simpleHeading"><p className="adminEyebrow">SHAMS / HUMANITY</p><h1>Content editor</h1><p>Open a section, make your changes, and save.</p></header>
    {params.saved && <p className="simpleSuccess" role="status">Changes saved.</p>}
    {!writable && <p className="adminNotice">Editing is read-only in this environment.</p>}
    {process.env.CONTENT_SOURCE?.trim().toLowerCase() !== "database" && <p className="adminNotice" role="alert"><strong>Public site uses local content.</strong> Database edits will not appear publicly until CONTENT_SOURCE=database is configured in Vercel and the site is redeployed after the database has been migrated and its records reviewed.</p>}
    {(() => { const pages = collections.find(collection => collection.type === "page")?.records ?? []; const home = pages.find(record => record.id === "page-home") ?? { ...localAdminRecords("page").find(record => record.id === "page-home")!, status: "published" as const }; return <SimpleCollection type="page" label="Homepage" records={[home]} writable={writable} selected={params.section === "page:page-home" ? params.section : undefined} />; })()}
    {collections.map(({ type, label, records }) => {
      const baseline = type !== "page" ? localAdminRecords(type as AdminContentType)[0] : undefined;
      const id = `${type}-${randomUUID()}`;
      const template = baseline ? { ...baseline, id, slug: type === "artist" ? "" : null, status: "draft" as const, sortOrder: (records.at(-1)?.sortOrder ?? 0) + 1, updatedAt: null, data: { ...baseline.data, id, status: "draft", ...(type === "artist" ? { name: "", slug: "" } : type === "gallery" ? { image: "", alt: "" } : type === "faq" ? { question: "", answer: "" } : {}) } } : undefined;
      return <SimpleCollection key={type} type={type} label={label} records={type === "page" ? records.filter(record => record.id !== "page-home") : records} writable={writable} template={template} selected={type === "page" && params.section === "page:page-home" ? undefined : params.section} />;
    })}
    {isOwnerIdentity(identity) && <AdminAccounts writable={writable} saved={Boolean(params.adminSaved)} />}
  </div>;
}
