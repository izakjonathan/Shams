import { ArrowUpRight, Download } from "lucide-react";
import { StatusBadge } from "./status-badge";

export function InvoiceCard() {
  return (
    <article className="invoice-card">
      <header><div><span>Invoice</span><strong>#INV-1048</strong></div><StatusBadge tone="warning">Due soon</StatusBadge></header>
      <div className="invoice-total"><span>Amount due</span><strong>€4,860.00</strong><small>Due 18 July 2026</small></div>
      <div className="invoice-meta"><div><span>Client</span><strong>Northstar Studio</strong></div><div><span>Issued</span><strong>02 July 2026</strong></div></div>
      <footer><button><Download size={16}/> Download</button><button>View invoice <ArrowUpRight size={16}/></button></footer>
    </article>
  );
}
