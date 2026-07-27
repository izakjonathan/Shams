# Shams for Humanity — v1.1.4

Mobile-first Next.js festival website.

## v1.1.4 — Full cleanup pass

- Replaced generated artist slugs with explicit, stable route slugs.
- Made artist and information-page content definitions readonly.
- Removed the obsolete content compatibility file.
- Consolidated JSON-LD serialization into one shared helper.
- Disabled unknown dynamic artist routes so only approved artist pages are generated.
- Removed TypeScript build cache output from the release archive.
- Added a repository `.gitignore` for build output, local environments, logs and OS files.
- Cleaned stale implementation comments while preserving the approved visual design.
- Preserved the splash lifecycle, Safari behavior, gradients, menu, artist photography, Agilera artist titles and information-page close controls.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run release:validate
npm run typecheck
npm run build
```

Or run the complete release check:

```bash
npm run release:check
```

Copy `.env.example` to `.env.local` when configuring ticket, newsletter, indexing or public-site URLs.
