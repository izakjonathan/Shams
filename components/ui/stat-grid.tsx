import { ArrowDownRight, ArrowUpRight } from "lucide-react";
const stats = [
  { label: "Revenue", value: "€84.2k", change: "+18.2%", up: true },
  { label: "Orders", value: "1,284", change: "+6.4%", up: true },
  { label: "Refunds", value: "2.8%", change: "-0.9%", up: false },
];
export function StatGrid() {
  return <div className="stat-grid">{stats.map((stat) => <article key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small className={stat.up ? "is-positive" : "is-negative"}>{stat.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {stat.change}</small></article>)}</div>;
}
