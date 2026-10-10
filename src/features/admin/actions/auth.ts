"use server";

import { consumeLoginAttempt } from "../server/login-throttle";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminConfigured, verifyCredentials } from "../server/auth";

export async function loginAction(formData: FormData) {
  if (!isAdminConfigured()) redirect("/admin/login?error=configuration");
  if (!(await consumeLoginAttempt())) redirect("/admin/login?error=throttled");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyCredentials(email, password)) redirect("/admin/login?error=credentials");
  await createAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
