"use client";
import { useState } from "react";
export function PasswordField() {
  const [visible, setVisible] = useState(false);
  return <span className="adminPasswordControl"><input type={visible ? "text" : "password"} name="password" autoComplete="new-password" minLength={15} maxLength={256} required /><button type="button" className="adminPasswordToggle" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} title={visible ? "Hide password" : "Show password"}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{!visible && <path d="M3 3 21 21" strokeWidth="2.5"/>}</svg></button></span>;
}
