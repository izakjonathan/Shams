import { RecordForm } from "./RecordForm";
import Link from "next/link";
import { saveRecordFormAction } from "../actions/content";
import { adminRouteForType } from "../server/routes";
import type { AdminContentType, AdminRecord } from "../server/content-admin";
import { StructuredFields } from "./StructuredFields";

export function RecordEditor({ record, type, writable }: { record: AdminRecord; type: AdminContentType; writable: boolean }) {
  const route = adminRouteForType(type);
  return (
    <section className="adminEditor" id="record-editor">
      <Link className="adminBackLink" href="/admin">← Back to site editing view</Link>
      <div className="adminSectionHeading">
        <div><p className="adminEyebrow">RECORD EDITOR</p><h2>{record.id}</h2></div>
        <div className="adminEditorMeta">
          <span>{writable ? "Database writes enabled" : "Editing is disabled in this environment"}</span>
          <Link href={`/admin/preview/${type}/${encodeURIComponent(record.id)}`}>Preview record</Link>
          <Link href={`/admin/revisions/${type}/${encodeURIComponent(record.id)}`}>Revision history</Link>
        </div>
      </div>
      <RecordForm action={saveRecordFormAction}>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="expectedUpdatedAt" value={record.updatedAt ?? ""} />
        <input type="hidden" name="returnRoute" value={route} />
        <label>Stable ID<input name="id" defaultValue={record.id} readOnly /></label>
        <div className="adminFieldGrid">
          <label>Slug<input name="slug" defaultValue={record.slug ?? ""} /></label>
          <label>Sort order<input name="sortOrder" type="number" defaultValue={record.sortOrder} /></label>
          <label>Status<select name="status" defaultValue={record.status}><option value="draft">Draft</option><option value="placeholder">Placeholder</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        </div>
        <p className="adminRecordState" role="status"><strong>{record.status === "published" ? "Published — visible on the website" : record.status === "draft" ? "Draft — not visible publicly" : record.status === "archived" ? "Archived — not visible publicly" : "Placeholder"}</strong>{record.updatedAt ? ` · Last saved ${new Date(record.updatedAt).toLocaleString("en-GB")}` : ""}</p>
        <StructuredFields record={record} type={type} />
        <details className="adminAdvanced"><summary>Advanced record JSON</summary><p>Read-only reference for debugging and migrations.</p><pre>{JSON.stringify(record.data, null, 2)}</pre></details>
        {type === "gallery" && <p className="adminRecordState">To show a new gallery image on the public website, click <strong>Publish</strong>. For an existing published image, <strong>Save changes</strong> updates the public gallery.</p>}
        <div className="adminEditorActions">
          <button className="adminPrimaryButton" name="intent" value="save" type="submit" disabled={!writable}>Save changes</button>
          <button className="adminSecondaryButton" name="intent" value="publish" type="submit" disabled={!writable}>Publish</button>
          <button className="adminSecondaryButton" name="intent" value="draft" type="submit" disabled={!writable}>Move to draft</button>
          <button className="adminDangerButton" name="intent" value="archive" type="submit" disabled={!writable}>Archive</button>
        </div>
      </RecordForm>
    </section>
  );
}
