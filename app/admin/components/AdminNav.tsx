import Link from "next/link";
import { logoutAction } from "../actions/auth";

const items = [
  ["Overview", "/admin"],
  ["Artists", "/admin/artists"],
  ["Programme", "/admin/programme"],
  ["Tickets", "/admin/tickets"],
  ["FAQs", "/admin/faqs"],
  ["Pages", "/admin/pages"],
  ["Audit log", "/admin/audit"],
] as const;

export function AdminNav({ identity }: { identity: string }) {
  return (
    <aside className="adminSidebar">
      <div><p className="adminEyebrow">SHAMS ADMIN</p><strong>Content studio</strong></div>
      <nav aria-label="Admin navigation">{items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="adminAccount"><span>{identity}</span><form action={logoutAction}><button type="submit">Sign out</button></form></div>
    </aside>
  );
}
