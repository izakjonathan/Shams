"use client";

import { LockKeyhole, Mail } from "lucide-react";

export function LoginForm() {
  return (
    <form className="login-form" onSubmit={(event) => event.preventDefault()}>
      <h3>Welcome back</h3>
      <p>Sign in to continue to Studio UI.</p>
      <label className="login-field">
        <Mail size={18} aria-hidden="true" />
        <span className="sr-only">Email</span>
        <input type="email" placeholder="Email" autoComplete="email" />
      </label>
      <label className="login-field">
        <LockKeyhole size={18} aria-hidden="true" />
        <span className="sr-only">Password</span>
        <input type="password" placeholder="Password" autoComplete="current-password" />
      </label>
      <div className="login-actions">
        <button type="submit">Sign in</button>
        <button type="button">Create account</button>
      </div>
      <button className="login-forgot" type="button">Forgot password?</button>
    </form>
  );
}
