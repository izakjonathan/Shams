# v1.3.4 Release Checklist

## Automated

```bash
npm run release:validate
npm run quality:check
npm run typecheck
npm run build
```

## Navigation

- Homepage → artist fades out and artist page fades in.
- Artist close fades out and returns to the matching compact-list row without visible scrolling.
- Previous/next artist navigation fades correctly.
- Information pages open and close using fades.
- Mobile-menu navigation removes the menu before the destination appears.
- Rapid repeated taps do not retarget an active transition.
- Failed navigation restores page visibility.
- Keyboard activation focuses the destination main content or anchor.
- Reduced-motion mode removes transition animation.

## Browser history

- Back and Forward restore the expected destination and scroll position without smooth route scrolling.
- Safari swipe-back is accepted as a native browser gesture; verify the committed destination fades in cleanly.

## Layout

- Compact artist list is present; no image-card grid remains.
- Programme has no public time or development-status labels.
- Programme filters show a continuation hint on narrow screens.
- No public placeholder/confirmed labels appear on artists or tickets.

## Deployment

- Generate and commit `package-lock.json` in a networked environment.
- Change Vercel install command to `npm ci --no-audit --no-fund` after the lockfile is committed.
- Keep indexing disabled while placeholder public information remains.
