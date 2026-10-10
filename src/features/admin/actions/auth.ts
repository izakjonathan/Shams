"use server";

import { initializeLoginProtection, consumeLoginAttempt } from "../server/login-throttle";
import { loginOutcome } from "../server/login-policy";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminConfigured, verifyCredentials } from "../server/auth";

export async function loginAction(formData: FormData) {
  if (!isAdminConfigured()) redirect("/admin/login?error=configuration");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const outcome = await loginOutcome(verifyCredentials(email, password), await consumeLoginAttempt(), initializeLoginProtection);
  if (outcome !== "success") redirect(`/admin/login?error=${outcome}`);
  await createAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
