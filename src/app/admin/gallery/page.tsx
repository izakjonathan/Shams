import { randomUUID } from "node:crypto";
import { SimpleRecordEditor } from "../../../features/admin/components/SimpleEditor";
import { RecordEditor } from "../../../features/admin/components/RecordEditor";
import { RecordList } from "../../../features/admin/components/RecordList";
import { requireAdmin } from "../../../features/admin/server/auth";
import { getAdminRecord, listAdminRecords, localAdminRecords } from "../../../features/admin/server/content-admin";
import { isContentWritable } from "../../../features/admin/server/write-policy";

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const result = await listAdminRecords("gallery");
  const selected = params.edit ? await getAdminRecord("gallery", params.edit) : null;
  const writable = isContentWritable();
  const baseline = localAdminRecords("gallery")[0];
  const id = `gallery-${randomUUID()}`;
  const template = baseline ? { ...baseline, id, slug: null, status: "draft" as const, sortOrder: Math.min(2147483647, Math.max(0, ...result.records.map(record => record.sortOrder)) + 1), updatedAt: null, data: { ...baseline.data, id, image: "", alt: "", status: "draft" } } : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Gallery</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <div className="adminNotice"><strong>Event atmosphere</strong><p>Order, describe, draft, publish, or archive the images used in the full-screen gallery before the Artists section.</p></div>
    {template && <details className="simpleAdd adminGalleryAdd" open={params.edit === "new"}><summary>+ Add gallery image</summary><p>Select a photo or image file, add alternative text, then save the new gallery entry as a draft.</p><SimpleRecordEditor record={template} writable={writable} creating /></details>}
    <RecordList records={result.records} type="gallery" source={result.source} />
    {selected && <RecordEditor record={selected} type="gallery" writable={writable} />}
  </>;
}
