"use server";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { requireOwner } from "../server/auth";
import { addAdminAccount, changeAdminAccount } from "../server/accounts";
import { safeDatabaseErrorCode } from "../server/login-policy";
export async function adminAccountFormAction(_state: { error: string }, form: FormData): Promise<{ error: string }> {
  try {
    const actor = await requireOwner();
    const intent = String(form.get("intent"));
    const email = String(form.get("email") ?? "");
    if (intent === "add") await addAdminAccount(actor, email, String(form.get("password") ?? ""));
    else if (intent === "reset") await changeAdminAccount(actor, email, String(form.get("password") ?? ""), null);
    else if (intent === "disable" || intent === "enable") await changeAdminAccount(actor, email, null, intent === "enable");
    else throw new Error("Invalid account action.");
    revalidatePath("/admin");
    redirect("/admin?adminSaved=1#section-admins");
  } catch (error) {
    unstable_rethrow(error);
    if (safeDatabaseErrorCode(error) === "23505") return { error: "This email already has an admin account." };
    if (error instanceof Error && /^(Enter a valid email|Use a password|This email is already|This email already has|The owner login|Only the owner|Admin account not found|Content writes are disabled)/.test(error.message)) return { error: error.message };
    console.error(`[admin accounts] Account change failed (${safeDatabaseErrorCode(error) ?? "unknown"}).`);
    return { error: "The account could not be saved. Check the database connection and migrations, then try again." };
  }
}
