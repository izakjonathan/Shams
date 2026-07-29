import Link from "next/link";
import type { AdminContentType, AdminRecord } from "../lib/content-admin";

function title(record: AdminRecord) {
  for (const key of ["name", "label", "type", "question", "title"] as const) {
    const value = record.data[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return record.id;
}

export function RecordList({ records, type, source }: { records: AdminRecord[]; type: AdminContentType; source: "local" | "database" }) {
  return (
    <div className="adminPanel">
      <div className="adminPanelHeader"><span>{records.length} records</span><span className={`adminSource adminSource--${source}`}>{source}</span></div>
      <div className="adminTable" role="table">
        {records.map((record) => (
          <Link className="adminRow" href={`/admin/${type === "artist" ? "artists" : type}?edit=${encodeURIComponent(record.id)}`} key={record.id}>
            <span className="adminOrder">{String(record.sortOrder).padStart(2, "0")}</span>
            <strong>{title(record)}</strong>
            <span>{record.slug ?? record.id}</span>
            <span className={`adminStatus adminStatus--${record.status}`}>{record.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
