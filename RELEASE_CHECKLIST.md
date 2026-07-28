# v1.4.0 Release Checklist

## Transition behavior

- [ ] Homepage artist → artist page uses a matched artist-title transition
- [ ] Artist close → matching lineup row uses the shorter close transition
- [ ] Previous/next artist uses the artist-switch transition
- [ ] Information pages use the editorial page transition
- [ ] Fixed header remains stable during page changes
- [ ] Artist image enters without blur or directional sliding
- [ ] Unsupported browsers use the fallback scale-and-opacity transition
- [ ] Reduced-motion mode removes meaningful animation
- [ ] Repeated taps do not start competing transitions
- [ ] Failed navigation restores the visible page

## Navigation and accessibility

- [ ] Destination positioning occurs while hidden
- [ ] Keyboard navigation places focus on the destination main content or hash target
- [ ] Route wrapper reports `aria-busy` while transitioning
- [ ] Loading state is announced through the live region
- [ ] Mobile-menu navigation does not leave the destination inert
- [ ] Browser Back/Forward completes without automatic smooth scrolling

## Build and deployment

- [ ] `npm run release:validate`
- [ ] `npm run audit:static`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Generate and commit `package-lock.json` in a networked environment
- [ ] Change Vercel install command to `npm ci --no-audit --no-fund` after the lockfile is committed
- [ ] Test on current iPhone Safari
- [ ] Test on current Chrome and Firefox
- [ ] Verify preview deployments remain noindex
