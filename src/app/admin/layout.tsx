import type { Metadata } from "next";
import "../../features/admin/admin.css";
import { AdminNav } from "../../features/admin/components/AdminNav";
import { getAdminIdentity, isAdminConfigured } from "../../features/admin/server/auth";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const identity = await getAdminIdentity();
  const isLogin = !identity;
  return (
    <main className={isLogin ? "adminLoginShell" : "adminShell"}>
      {!isLogin && <AdminNav identity={identity} />}
      <section className="adminMain" data-configured={isAdminConfigured()}>{children}</section>
    </main>
  );
}
