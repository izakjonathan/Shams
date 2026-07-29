# v2.1.6 artist arrow restoration audit

- Fixed the admin authentication constant-time comparison to use `TextEncoder`-produced `Uint8Array` values instead of generic `Buffer` values.
- This avoids the Node 22 TypeScript `ArrayBufferLike` / `SharedArrayBuffer` incompatibility reported by Vercel at `app/admin/lib/auth.ts`.
- Credential and session signature comparisons remain constant-time through `node:crypto` `timingSafeEqual`.
- Reviewed all remaining `Buffer.from` calls; they are encoding/decoding operations and are not passed to `timingSafeEqual`.
- Release and static architecture validation pass.

## v2.1.6 selective UX merge

Verified that only the approved UX changes were merged. The TextEncoder authentication fix, shared motion utilities, iOS WebKit canvas guard, settled viewport sampling, conditional route curtain, CSS-derived timing fallbacks, menu translate3d hardening, and corrected audit execution order remain intact.


## Artist arrow regression check

- The mobile-only `.artistArrow` 44 px size override has been removed.
- Homepage artist arrows inherit the shared `--icon-button-size` token from `homepage.css`.
- No negative margin is applied to artist arrow controls.
- All other v2.1.4 accessibility improvements remain intact.

## v2.1.6 footer viewport correction
- Removed the 160 px `siteFooter::after` flow-content bleed that made the footer taller than one viewport.
- The footer retains `100vh`/`100svh`/`100dvh` minimum sizing and safe-area padding.
- Safari toolbar coverage now relies on the existing explicit black `html`/`body` canvas at true document bottom, avoiding extra layout height.
- Confirmed the footer bottom row still uses `margin-top: auto`, so the footer composition fills one screen without a trailing empty block.

