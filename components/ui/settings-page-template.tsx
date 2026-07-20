import { Bell, CreditCard, KeyRound, Palette, Save, ShieldCheck, UserRound } from "lucide-react";
import { ToggleSwitch } from "./toggle-switch";

export function SettingsPageTemplate() {
  return (
    <section className="template template--settings">
      <aside className="settings-nav"><header><span>IH</span><div><strong>Izak Hyllested</strong><small>Workspace owner</small></div></header><nav><button className="is-active"><UserRound size={16}/> Profile</button><button><Bell size={16}/> Notifications</button><button><ShieldCheck size={16}/> Security</button><button><CreditCard size={16}/> Billing</button><button><Palette size={16}/> Appearance</button></nav></aside>
      <form className="settings-content" onSubmit={(event)=>event.preventDefault()}>
        <header><div><small>Account</small><h3>Profile settings</h3><p>Manage the details shown across your workspace.</p></div><button><Save size={15}/> Save changes</button></header>
        <section><h4>Personal information</h4><div className="settings-grid"><label><span>First name</span><input defaultValue="Izak"/></label><label><span>Last name</span><input defaultValue="Hyllested"/></label><label className="is-wide"><span>Email</span><input type="email" defaultValue="izak@example.com"/></label></div></section>
        <section><h4>Workspace preferences</h4><div className="settings-option"><div><Bell size={17}/><span><strong>Weekly summary</strong><small>Receive a concise performance summary every Monday.</small></span></div><ToggleSwitch label="" defaultChecked/></div><div className="settings-option"><div><KeyRound size={17}/><span><strong>Login alerts</strong><small>Get notified when a new device accesses your account.</small></span></div><ToggleSwitch label=""/></div></section>
      </form>
    </section>
  );
}
