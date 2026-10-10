import Link from "next/link";
import { RecordForm } from "./RecordForm";
import { StructuredFields } from "./StructuredFields";
import { saveRecordFormAction, createRecordFormAction, moveRecordFormAction } from "../actions/content";
import type { AdminRecord, AdminContentType } from "../types";

export function recordTitle(record: AdminRecord) {
  for (const key of ["name", "question", "label", "title", "alt", "type"]) {
    if (typeof record.data[key] === "string") return String(record.data[key]);
  }
  return record.id === "page-home" ? "Homepage text" : record.id;
}
export function SimpleRecordEditor({ record, writable, creating = false }: { record: AdminRecord; writable: boolean; creating?: boolean }) {
  return <div className="adminEditor simpleRecordEditor">
    <RecordForm action={creating ? createRecordFormAction : saveRecordFormAction}>
      <input type="hidden" name="type" value={record.type} />
      <input type="hidden" name="id" value={record.id} />
      <input type="hidden" name="expectedUpdatedAt" value={record.updatedAt ?? ""} />
      <input type="hidden" name="returnRoute" value="simple" />
      <input type="hidden" name="status" value={record.status} />
      <input type="hidden" name="sortOrder" value={record.sortOrder} />
      {record.type === "artist" ? <label>Page address<input name="slug" defaultValue={record.slug ?? ""} required /></label> : <input type="hidden" name="slug" value={record.slug ?? ""} />}
      <StructuredFields record={record} type={record.type} />
      <div className="simpleSave"><button className="adminPrimaryButton" name="intent" value="save" disabled={!writable}>{creating ? "Save draft" : "Save changes"}</button>
      {!creating && record.status !== "published" && <button className="adminSecondaryButton" name="intent" value="publish" disabled={!writable}>Publish</button>}</div>
      {!creating && record.id !== "page-home" && <details className="simpleMore"><summary>More options</summary><div className="adminEditorActions"><Link href={`/admin/revisions/${record.type}/${encodeURIComponent(record.id)}`}>Revision history</Link><button className="adminSecondaryButton" name="intent" value="draft" disabled={!writable}>Move to draft</button><button className="adminDangerButton" name="intent" value="archive" disabled={!writable}>Archive</button></div></details>}
    </RecordForm>
  </div>;
}
export function SimpleCollection({ type, label, records, writable, template, selected }: { type: AdminContentType; label: string; records: AdminRecord[]; writable: boolean; template?: AdminRecord; selected?: string }) {
  return <details className="simpleSection" id={label === "Homepage" ? "section-home" : `section-${type}`} open={selected?.startsWith(`${type}:`)}>
    <summary><span>{label}</span><span className="simpleCount">{records.length} <span aria-hidden="true">+</span></span></summary>
    <div className="simpleSectionBody">
      {records.length === 0 && <p>No entries yet.</p>}
      {records.map((record, index) => record.id === "page-home" ? <SimpleRecordEditor key={record.id} record={record} writable={writable} /> : <details className="simpleRecord" key={`${record.id}:${record.updatedAt}`} open={selected === `${type}:${record.id}`}>
        <summary><span>{recordTitle(record)}</span><span className={`adminStatus adminStatus--${record.status}`}>{record.status}</span></summary>
        <SimpleRecordEditor record={record} writable={writable} />
        {type !== "page" && <div className="simpleOrder">{([-1, 1] as const).map(direction => <RecordForm action={moveRecordFormAction} key={direction}><input type="hidden" name="type" value={type}/><input type="hidden" name="id" value={record.id}/><input type="hidden" name="expectedUpdatedAt" value={record.updatedAt ?? ""}/><input type="hidden" name="direction" value={direction}/><button disabled={!writable || (direction === -1 ? index === 0 : index === records.length - 1)}>{direction === -1 ? "↑ Move up" : "↓ Move down"}</button></RecordForm>)}</div>}
      </details>)}
      {template && <details className="simpleAdd"><summary>+ Add {type === "ticket" ? "ticket" : type === "gallery" ? "image" : type === "faq" ? "FAQ" : type}</summary><SimpleRecordEditor record={template} writable={writable} creating /></details>}
    </div>
  </details>;
}
