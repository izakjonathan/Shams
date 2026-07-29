"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, isAdminConfigured, verifyCredentials } from "../lib/auth";

export async function loginAction(formData: FormData) {
  if (!isAdminConfigured()) redirect("/admin/login?error=configuration");
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
