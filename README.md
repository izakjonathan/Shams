# Shams for Humanity v2.2.0

## Verification and regression foundation

This release preserves the approved Shams visual language, splash, hero, Safari canvas handling, footer-contact behaviour, mobile menu, editorial route curtain, typed content architecture, and admin/database foundation. Its purpose is to make future development test-led rather than adding another visual or architectural layer.

### Included

- Playwright smoke-test configuration for Chromium and mobile WebKit.
- Behavioural coverage for the splash lifecycle, repeat visits, mobile menu, artist navigation, legal-page footer return, programme filters, reduced motion, contact mail links, and admin-route isolation.
- An opt-in visual regression project for the hero, programme, artist, legal, and footer surfaces.
- One verification command that runs theme generation, release validation, architecture audit, TypeScript, production build, and browser smoke tests when dependencies are installed.
- A GitHub Actions quality-gate workflow with Playwright traces and HTML-report artifacts.
- A deployment and rollback runbook.
- Updated QA documentation and cumulative changelog.

### Important unresolved install constraint

A trustworthy `package-lock.json` could not be generated in the build environment because public npm resolution timed out and the prior internal registry did not provide the pinned Node typings. The included CI workflow deliberately refuses to pass until a lockfile is generated in a normal networked development environment and committed. Vercel continues using the existing install command until that step is completed.

### Local verification after generating the lockfile

```bash
npm install
npx playwright install chromium webkit
npm run verify
npm run test:visual:update
```

Visual baselines should only be committed after reviewing them against the approved design.
