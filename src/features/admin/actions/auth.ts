"use server";

import { initializeLoginProtection, consumeLoginAttempt } from "../server/login-throttle";
import { loginOutcome } from "../server/login-policy";
import { safeDatabaseErrorCode } from "../server/login-policy";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminConfigured, verifyCredentials } from "../server/auth";

export async function loginAction(formData: FormData) {
  if (!isAdminConfigured()) redirect("/admin/login?error=configuration");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const protection = await consumeLoginAttempt();
  if (protection === "limited") redirect("/admin/login?error=throttled");
  if (protection === "unavailable") redirect("/admin/login?error=protection-unavailable");
  let verified = false;
  try { verified = email.length <= 254 && password.length <= 256 && await verifyCredentials(email, password); }
  catch (error) { console.error(`[admin login] Account storage unavailable (${safeDatabaseErrorCode(error) ?? "unknown"}).`); redirect("/admin/login?error=protection-unavailable"); }
  const outcome = await loginOutcome(verified, protection, initializeLoginProtection);
  if (outcome !== "success") redirect(`/admin/login?error=${outcome}`);
  try { await createAdminSession(email, password); }
  catch (error) {
    if (error instanceof Error && error.message === "Credentials changed during sign-in.") redirect("/admin/login?error=credentials");
    console.error(`[admin login] Session creation failed (${safeDatabaseErrorCode(error) ?? "unknown"}).`);
    redirect("/admin/login?error=protection-unavailable");
  }
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
