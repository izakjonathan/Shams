import { listAdminAccounts } from "../server/accounts";
import { adminAccountFormAction } from "../actions/accounts";
import { PasswordField } from "./PasswordField";
import { RecordForm } from "./RecordForm";
export async function AdminAccounts({ writable, saved }: { writable: boolean; saved: boolean }) {
  const accounts = await listAdminAccounts();
  return <details className="simpleSection" id="section-admins" open={saved}><summary><span>Admins</span><span className="simpleCount">{accounts.length + 1} <span aria-hidden="true">+</span></span></summary><div className="simpleSectionBody">
    <p>Your Vercel login is the owner account. Added admins can edit site content. Only the owner manages accounts.</p>
    {saved && <p className="simpleSuccess" role="status">Admin account updated.</p>}
    {accounts.map(account => <details className="simpleRecord" key={account.email}><summary><span>{account.email}</span><span className="adminStatus">{account.enabled ? "Active" : "Disabled"}</span></summary><div className="adminEditor simpleRecordEditor">
      <RecordForm action={adminAccountFormAction}><input type="hidden" name="email" value={account.email}/><button className="adminSecondaryButton" name="intent" value={account.enabled ? "disable" : "enable"} disabled={!writable}>{account.enabled ? "Disable access" : "Enable access"}</button></RecordForm>
      <details className="simpleMore"><summary>Reset password</summary><RecordForm action={adminAccountFormAction}><input type="hidden" name="email" value={account.email}/><label>New password<PasswordField /></label><button className="adminPrimaryButton" name="intent" value="reset" disabled={!writable}>Save password</button></RecordForm></details>
    </div></details>)}
    <details className="simpleAdd"><summary>+ Add admin</summary><div className="adminEditor simpleRecordEditor"><RecordForm action={adminAccountFormAction}><label>Email<input type="email" name="email" autoComplete="off" maxLength={254} required /></label><label>Password<PasswordField /><small>At least 15 characters. Share it securely with the new admin.</small></label><button className="adminPrimaryButton" name="intent" value="add" disabled={!writable}>Add admin</button></RecordForm></div></details>
  </div></details>;
}
