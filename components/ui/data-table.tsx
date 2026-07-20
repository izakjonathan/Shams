import { MoreHorizontal } from "lucide-react";
import { StatusBadge } from "./status-badge";

const rows = [
  { name: "Northstar", owner: "Maya Chen", status: "Active", value: "€18,420" },
  { name: "Atlas", owner: "Noah Smith", status: "Pending", value: "€9,860" },
  { name: "Horizon", owner: "Emma Wilson", status: "Draft", value: "€6,200" },
  { name: "Ember", owner: "Liam Brown", status: "Active", value: "€14,100" },
];

export function DataTable() {
  return <div className="data-table-wrap">
    <table className="data-table">
      <caption className="sr-only">Project overview</caption>
      <thead><tr><th>Project</th><th>Owner</th><th>Status</th><th className="numeric">Value</th><th><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row.name}>
        <td><strong>{row.name}</strong><span>Updated today</span></td>
        <td>{row.owner}</td>
        <td><StatusBadge tone={row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "neutral"}>{row.status}</StatusBadge></td>
        <td className="numeric">{row.value}</td>
        <td><button className="table-action" aria-label={`Open actions for ${row.name}`}><MoreHorizontal size={17}/></button></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
