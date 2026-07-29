# v2.1.4 deployment type-fix audit

- Fixed the admin authentication constant-time comparison to use `TextEncoder`-produced `Uint8Array` values instead of generic `Buffer` values.
- This avoids the Node 22 TypeScript `ArrayBufferLike` / `SharedArrayBuffer` incompatibility reported by Vercel at `app/admin/lib/auth.ts`.
- Credential and session signature comparisons remain constant-time through `node:crypto` `timingSafeEqual`.
- Reviewed all remaining `Buffer.from` calls; they are encoding/decoding operations and are not passed to `timingSafeEqual`.
- Release and static architecture validation pass.

## v2.1.4 selective UX merge

Verified that only the approved UX changes were merged. The TextEncoder authentication fix, shared motion utilities, iOS WebKit canvas guard, settled viewport sampling, conditional route curtain, CSS-derived timing fallbacks, menu translate3d hardening, and corrected audit execution order remain intact.
