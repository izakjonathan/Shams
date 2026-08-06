import type { Metadata } from "next";
import "./admin.css";
import { AdminNav } from "./components/AdminNav";
import { getAdminIdentity, isAdminConfigured } from "./lib/auth";

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
