import Link from "next/link";
import { saveRecordAction } from "../actions/content";
import { adminRouteForType } from "../lib/routes";
import type { AdminContentType, AdminRecord } from "../lib/content-admin";
import { StructuredFields } from "./StructuredFields";

export function RecordEditor({ record, type, writable }: { record: AdminRecord; type: AdminContentType; writable: boolean }) {
  const route = adminRouteForType(type);
  return (
    <section className="adminEditor">
      <div className="adminSectionHeading">
        <div><p className="adminEyebrow">RECORD EDITOR</p><h2>{record.id}</h2></div>
        <div className="adminEditorMeta">
          <span>{writable ? "Database writes enabled" : "Connect DATABASE_URL to edit"}</span>
          <Link href={`/admin/preview/${type}/${encodeURIComponent(record.id)}`}>Preview record</Link>
        </div>
      </div>
      <form action={saveRecordAction}>
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="expectedUpdatedAt" value={record.updatedAt ?? ""} />
        <input type="hidden" name="returnRoute" value={route} />
        <label>Stable ID<input name="id" defaultValue={record.id} readOnly /></label>
        <div className="adminFieldGrid">
          <label>Slug<input name="slug" defaultValue={record.slug ?? ""} /></label>
          <label>Sort order<input name="sortOrder" type="number" defaultValue={record.sortOrder} /></label>
          <label>Status<select name="status" defaultValue={record.status}><option value="draft">Draft</option><option value="placeholder">Placeholder</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        </div>
        <input type="hidden" name="originalData" value={JSON.stringify(record.data)} />
        <StructuredFields record={record} type={type} />
        <details className="adminAdvanced"><summary>Advanced record JSON</summary><p>Read-only reference for debugging and migrations.</p><pre>{JSON.stringify(record.data, null, 2)}</pre></details>
        <div className="adminEditorActions">
          <button className="adminPrimaryButton" name="intent" value="save" type="submit" disabled={!writable}>Save changes</button>
          <button className="adminSecondaryButton" name="intent" value="publish" type="submit" disabled={!writable}>Publish</button>
          <button className="adminSecondaryButton" name="intent" value="draft" type="submit" disabled={!writable}>Move to draft</button>
          <button className="adminDangerButton" name="intent" value="archive" type="submit" disabled={!writable}>Archive</button>
        </div>
      </form>
    </section>
  );
}
