# v2.1.3 deployment type-fix audit

- Fixed the admin authentication constant-time comparison to use `TextEncoder`-produced `Uint8Array` values instead of generic `Buffer` values.
- This avoids the Node 22 TypeScript `ArrayBufferLike` / `SharedArrayBuffer` incompatibility reported by Vercel at `app/admin/lib/auth.ts`.
- Credential and session signature comparisons remain constant-time through `node:crypto` `timingSafeEqual`.
- Reviewed all remaining `Buffer.from` calls; they are encoding/decoding operations and are not passed to `timingSafeEqual`.
- Release and static architecture validation pass.
