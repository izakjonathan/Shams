import { saveRecordAction } from "../actions/content";
import type { AdminContentType, AdminRecord } from "../lib/content-admin";

export function RecordEditor({ record, type, writable }: { record: AdminRecord; type: AdminContentType; writable: boolean }) {
  return (
    <section className="adminEditor">
      <div className="adminSectionHeading"><div><p className="adminEyebrow">RECORD EDITOR</p><h2>{record.id}</h2></div><span>{writable ? "Database writes enabled" : "Connect DATABASE_URL to edit"}</span></div>
      <form action={saveRecordAction}>
        <input type="hidden" name="type" value={type} />
        <label>Stable ID<input name="id" defaultValue={record.id} readOnly /></label>
        <div className="adminFieldGrid">
          <label>Slug<input name="slug" defaultValue={record.slug ?? ""} /></label>
          <label>Sort order<input name="sortOrder" type="number" defaultValue={record.sortOrder} /></label>
          <label>Status<select name="status" defaultValue={record.status}><option value="draft">Draft</option><option value="placeholder">Placeholder</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        </div>
        <label>Structured JSON<textarea name="data" defaultValue={JSON.stringify(record.data, null, 2)} spellCheck={false} /></label>
        <button className="adminPrimaryButton" type="submit" disabled={!writable}>Save record</button>
      </form>
    </section>
  );
}
