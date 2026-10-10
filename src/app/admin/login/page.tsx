import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "../../../features/admin/actions/auth";
import { getAdminIdentity, isAdminConfigured } from "../../../features/admin/server/auth";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdminIdentity()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="adminLoginCard">
      <p className="adminEyebrow">SHAMS FOR HUMANITY</p><h1>Admin access</h1>
      {!isAdminConfigured() && <p className="adminNotice">Set ADMIN_EMAIL, ADMIN_PASSWORD and a 32+ character ADMIN_SESSION_SECRET before signing in.</p>}
      {error === "credentials" && <p className="adminError" role="alert">The email or password is incorrect.</p>}
      {error === "throttled" && <p className="adminError" role="alert">Sign-in is temporarily unavailable. Wait 15 minutes and try again. If it persists, contact the site administrator.</p>}
      <form action={loginAction}><label>Email<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="adminPrimaryButton" type="submit">Sign in</button></form>
      <Link href="/">Return to site</Link>
    </div>
  );
}
