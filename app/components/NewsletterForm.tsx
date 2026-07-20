"use client";

import type { FormEvent } from "react";

export function NewsletterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No newsletter provider is wired up yet — swap this for a real POST
    // (e.g. to an email service's API route) once one is chosen.
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          required
        />
        <button type="submit">Join us</button>
      </div>
      <p>No noise. Only meaningful updates.</p>
    </form>
  );
}
