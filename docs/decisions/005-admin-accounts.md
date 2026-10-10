# Multiple admin identities

## 2.10.6 — Multiple admin logins

The owner sees an Admins section in the single-page editor. Add an email/password account, reset a password, disable or re-enable access. The existing Vercel-configured login stays the owner and cannot be modified through these forms. Added admins have full content editing access but cannot manage admin accounts. All account actions authorize the owner on the server, enforce the existing preview write policy, normalize emails, validate passwords (15–256 characters), and store unique salted scrypt hashes (N=32768/r=8/p=3) rather than plaintext. Hashes/session-binding data are never selected for UI or written to audit logs.

Database account sessions use the same secure cookie/8-hour duration, with signatures bound to the stored password hash and session version. Every protected request checks the account; password reset, disable and enable invalidate prior sessions. Re-enabling requires a fresh login. Login throttling runs before expensive password hashing. Credentials are rechecked against the account snapshot used to issue the session, closing password-reset races. Account creation/change and safe audit entries commit in one transaction.

New additive migration: 0004_admin_accounts.sql. For a simple first use, an authenticated owner Add admin action can initialize only this security table, under the same advisory lock and with identical DDL as the migration. It does not apply other migrations or modify the migration ledger. Run the normal migration workflow to record 0004; it remains safe after first-use setup. A restricted DB role without CREATE permission requires an operator to apply 0004 before adding accounts. Existing content/audit tables and earlier migrations remain prerequisites. No production deployment or data changes have been performed.

Password parameter source: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

Environment owner credentials remain the bootstrap/recovery authority. Database accounts deliberately have content-admin access without owner privileges. Session checks read the current account without caching, to enforce revocation on the next request. Already executing requests may complete before revocation; no claim of cancelling in-flight writes is made. Email change and self-service password recovery are outside this release; the owner can disable an old email and create the replacement. Passwords must be shared out of band by the owner. No invitation emails are sent.
