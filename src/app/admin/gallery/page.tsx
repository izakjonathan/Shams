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
  const publishedCount = result.records.filter((record) => record.status === "published").length;
  const baseline = localAdminRecords("gallery")[0];
  const id = `gallery-${randomUUID()}`;
  const template = baseline ? { ...baseline, id, slug: null, status: "draft" as const, sortOrder: Math.min(2147483647, Math.max(0, ...result.records.map(record => record.sortOrder)) + 1), updatedAt: null, data: { ...baseline.data, id, image: "", alt: "", status: "draft" } } : null;
  return <>
    <header className="adminPageHeader"><div><p className="adminEyebrow">CONTENT</p><h1>Gallery</h1></div>{params.saved && <span className="adminSaved">Saved</span>}</header>
    <div className="adminNotice"><strong>Event atmosphere</strong><p>Upload or replace a photograph, then save the record. Published records update the public gallery; for a new image choose Save & publish to make it visible immediately, or Save draft to keep it private. The gallery also rotates automatically and has previous/next controls.</p></div>
    {process.env.CONTENT_SOURCE?.trim().toLowerCase() !== "database" && <div className="adminNotice" role="alert"><strong>Public gallery is using local images</strong><p>Changes made in the database will not appear on the public website while CONTENT_SOURCE is set to local (or unset). After database migration and publication review, set CONTENT_SOURCE=database in Vercel and redeploy.</p></div>}
    {result.source === "database" && publishedCount < 2 && <div className="adminNotice" role="alert"><strong>Slideshow needs at least two published images</strong><p>Currently {publishedCount} gallery image{publishedCount === 1 ? " is" : "s are"} published. Publish at least two images to enable automatic cycling on the public site.</p></div>}
    {template && <details className="simpleAdd adminGalleryAdd" open={params.edit === "new"}><summary>+ Add gallery image</summary><p>Select a photo or image file, add alternative text, then choose Save draft or Save &amp; publish to show it on the public site.</p><SimpleRecordEditor record={template} writable={writable} creating /></details>}
    <RecordList records={result.records} type="gallery" source={result.source} />
    {selected && <RecordEditor record={selected} type="gallery" writable={writable} />}
  </>;
}
