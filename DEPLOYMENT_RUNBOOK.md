# Deployment and rollback runbook

## 1. Prepare the release

1. Use Node 22 and npm 10.9.4.
2. Run `npm install` from a trusted public npm connection.
3. Review the generated `package-lock.json` and commit it.
4. Install browsers with `npx playwright install chromium webkit`.
5. Run `npm run verify`.
6. Generate or review visual baselines with `npm run test:visual:update`.
7. Commit only screenshots that match the approved Shams design.

## 2. Preview deployment

1. Deploy to a Vercel preview with production-like non-secret configuration.
2. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false`.
3. Run the smoke suite against the preview using `PLAYWRIGHT_BASE_URL=<preview-url> npm run test:e2e`.
4. Verify splash first visit and repeat visit.
5. Verify menu, artist route curtain, information-page close, programme filters, and footer contact.
6. Verify `/admin/login` and a non-production database write when a preview database is configured.
7. Inspect Vercel build and runtime logs.

## 3. Real-device gate

On a real iPhone Safari, test expanded and collapsed bottom-toolbar states, top status tint, splash bleed/runway, menu, route curtain, maximum footer scroll, orientation change, and reduced motion. Automated WebKit emulation does not replace this gate.

## 4. Production promotion

Promote only the exact preview deployment that passed the checks. Confirm environment variables before promotion and retain the previous production deployment and ZIP as rollback points.

## 5. Rollback

If a regression appears:

1. Reassign the production domain to the previous successful Vercel deployment or use Vercel rollback/redeploy.
2. Restore the previous confirmed ZIP baseline.
3. Do not patch production directly.
4. Reproduce the failure in a preview and add or update a regression test before the next promotion.
