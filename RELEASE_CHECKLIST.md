# v2.2.0 release checklist

## Source and architecture

- [x] Built from v2.1.9
- [x] Approved visual and Safari systems preserved
- [x] Playwright configuration added
- [x] Public navigation smoke tests added
- [x] Splash lifecycle smoke tests added
- [x] Accessibility and reduced-motion smoke tests added
- [x] Admin-route isolation smoke tests added
- [x] Visual regression harness added
- [x] CI quality-gate workflow added
- [x] Deployment and rollback runbook added

## Verified in this environment

- [x] Theme generation
- [x] Release configuration validation
- [x] Static architecture audit
- [x] Validation-script syntax
- [x] CSS brace validation
- [x] ZIP integrity

## Must be completed in a networked development environment

- [ ] Generate and commit `package-lock.json`
- [ ] Run `npm ci`
- [ ] Run TypeScript check
- [ ] Run production Next.js build
- [ ] Install Playwright Chromium and WebKit
- [ ] Run smoke tests
- [ ] Review and commit approved visual baselines
- [ ] Run database migration and admin-write tests
- [ ] Verify on a deployed Vercel preview
- [ ] Verify Safari canvas and footer on a real iPhone
