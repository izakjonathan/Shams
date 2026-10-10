import { HomePage } from "../../features/site/components/HomePage";
import { requireAdmin } from "../../features/admin/server/auth";
import { SiteFooter } from "../../features/site/components/SiteFooter";
import Link from "next/link";

export default async function AdminOverview() {
  await requireAdmin();
  return <>
    <div className="adminPreviewNotice"><span>Published site · editing view</span><Link href="/admin/pages">Edit contact & information pages ↗</Link></div>
    <HomePage editing />
    <SiteFooter />
  </>;
}
