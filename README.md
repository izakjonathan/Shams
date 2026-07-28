# Shams for Humanity — v1.1.8

Mobile-first Next.js festival website.

## v1.1.8 — Vercel deployment stability

This patch preserves all approved visual and accessibility improvements from v1.1.7 while removing development-only packages that caused Vercel dependency resolution to stall.

### Changes

- Removed ESLint and Playwright from the deployable package dependency tree.
- Removed their configuration and test files from the production ZIP.
- Pinned TypeScript to 5.9.3 to prevent npm resolving a different compiler version.
- Removed the package-level Node engine override so the Vercel project setting controls the runtime without warnings.
- Restored the small, previously proven install dependency set.
- Kept the split CSS, modal accessibility fixes, menu overflow support, theme-color reconciliation, security cleanup, content model improvements, and stricter release validation from v1.1.7.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run release:check
```

## Deployment

The archive has a flat structure and is ready for GitHub/Vercel deployment. The custom domain can remain unset until launch.
