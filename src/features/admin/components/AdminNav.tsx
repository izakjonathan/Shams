import Link from "next/link";
import { logoutAction } from "../actions/auth";
export function AdminNav({ identity }: { identity: string }) {
  return <header className="simpleToolbar"><Link href="/admin" className="simpleBrand">SHAMS / HUMANITY</Link><div><Link href="/" target="_blank" rel="noreferrer">View website ↗</Link><form action={logoutAction}><button>Sign out</button></form><details><summary>Tools</summary><nav aria-label="Admin tools"><Link href="/admin/media">Media</Link><Link href="/admin/revisions">Revisions</Link><Link href="/admin/audit">Audit log</Link></nav></details></div><span className="srOnly">Signed in as {identity}</span></header>;
}
