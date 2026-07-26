export function NewsletterForm() {
  const formAction = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim();
  const isConfigured = Boolean(formAction);

  return (
    <form action={formAction || undefined} method="post">
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
          disabled={!isConfigured}
        />
        <button type="submit" disabled={!isConfigured}>
          {isConfigured ? "Join us" : "Coming soon"}
        </button>
      </div>
      <p>
        {isConfigured
          ? "No noise. Only meaningful updates."
          : "Newsletter registration will open soon."}
      </p>
    </form>
  );
}
