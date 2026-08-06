import { RecordEditor } from "../components/RecordEditor";
import { RecordList } from "../components/RecordList";
import { requireAdmin } from "../lib/auth";
import { getAdminRecord, listAdminRecords } from "../lib/content-admin";
import { isDatabaseConfigured } from "../../db/client";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("gallery");
  const selected = params.edit ? await getAdminRecord("gallery", params.edit) : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Gallery</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <div className="adminNotice"><strong>Event atmosphere</strong><p>Order, describe, draft, publish, or archive the images used in the full-screen gallery before the Artists section.</p></div>
    <RecordList records={result.records} type="gallery" source={result.source} />
    {selected && <RecordEditor record={selected} type="gallery" writable={isDatabaseConfigured()} />}
  </>;
}
