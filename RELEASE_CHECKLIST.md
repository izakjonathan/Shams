# Shams for Humanity — v1.1.4 release record

This patch is a code and repository cleanup of the confirmed working v1.1.3 design.

## Automated checks

- [ ] `npm run release:validate`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] No browser console errors on the deployed preview

## Regression checks

- [ ] Splash appears once per tab session only
- [ ] Safari top and bottom canvas behavior is unchanged
- [ ] Mobile menu opens, closes, traps keyboard focus and unmounts correctly
- [ ] Homepage anchor navigation works
- [ ] All six artist routes load from their stable slugs
- [ ] Artist names use Agilera
- [ ] Artist images retain their intended crops
- [ ] Privacy, Terms, Accessibility and Contact close controls return home
- [ ] FAQ, ticket and newsletter disabled states remain correct

## Deferred launch configuration

- [ ] Final public domain
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] Final ticket URL
- [ ] Final newsletter endpoint
- [ ] Final legal, contact and artist copy
