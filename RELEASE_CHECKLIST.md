# Release checklist

## Automated checks

- [ ] Generate and commit `package-lock.json`.
- [ ] Switch deployment install command to `npm ci --no-audit --no-fund` after the lockfile exists.
- [ ] Run `npm run release:check` successfully.
- [ ] Run `npm run test:e2e:chromium` successfully.
- [ ] Run the mobile WebKit Playwright project after installing Playwright browsers.
- [ ] Confirm there are no console, hydration, route, image or font errors.

## Content and integrations

- [ ] Replace all `.example` addresses and provisional organizer details.
- [ ] Confirm artist biographies, credits, images, links, times and stages.
- [ ] Confirm venue, access information and event schedule.
- [ ] Configure ticket and newsletter environment variables when ready.
- [ ] Review Privacy, Terms, Accessibility and Contact copy.

## Device verification

- [ ] iPhone Safari: first splash, repeat navigation, browser chrome, menu and gradients.
- [ ] iPhone Safari landscape and zoomed text: menu remains scrollable.
- [ ] Android Chrome.
- [ ] Desktop Safari, Chrome and Firefox.
- [ ] Keyboard-only navigation and visible focus.
- [ ] VoiceOver or another screen reader on the homepage, menu and one artist page.

## Indexing and domain

- [ ] Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` while public information is provisional.
- [ ] Add the final site URL when the domain is ready.
- [ ] Enable indexing only after `npm run release:validate` passes with final public content.
- [ ] Verify canonical URLs, robots, sitemap and sharing previews.


## Vercel installation

- Confirm the deployment reaches `npm run build` after the dependency installation step.
- Do not add ESLint or Playwright back to the deployable package without a committed lockfile and a verified clean install.
