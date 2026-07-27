# Shams for Humanity — v1.0 release checklist

This checklist deliberately separates work that can be completed now from the final-domain step.

## Release candidate checks

- [ ] Run `npm install` from a clean checkout.
- [ ] Run `npm run release:check` successfully.
- [ ] Run the production server with `npm run start` and inspect every route.
- [ ] Confirm there are no browser-console errors or hydration warnings.
- [ ] Confirm all images, icons and the Agilera font return HTTP 200.

## Required device tests

- [ ] Current iPhone Safari.
- [ ] A second iPhone/iOS version where available.
- [ ] Android Chrome.
- [ ] Desktop Safari.
- [ ] Desktop Chrome.
- [ ] Desktop Firefox.

Verify on each relevant device:

- [ ] Splash appears once per tab session only.
- [ ] Artist-page navigation and browser Back do not replay or flash the splash.
- [ ] Menu animates smoothly both in and out.
- [ ] Menu closes with Escape and keeps keyboard focus contained while open.
- [ ] Menu fully disappears from the DOM after closing.
- [ ] Safari top and bottom browser areas remain visually correct.
- [ ] Dark and light gradients render without boxes, hard rings or flicker.
- [ ] Hash links land below the fixed header.
- [ ] FAQ, artist links and ticket states work.

## Content and integrations

- [ ] Confirm final event date, times, venue wording and accessibility details.
- [ ] Confirm lineup names, artist slugs, performance types, times and stages.
- [ ] Add final artist biographies, images and approved social links.
- [ ] Configure `NEXT_PUBLIC_TICKET_URL` and complete a real checkout-link test.
- [ ] Configure `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` and complete a real form submission test.
- [ ] Add final Instagram, Facebook and contact destinations.
- [ ] Add privacy/newsletter consent wording required by the chosen provider.

## Final domain — deferred

Until the custom domain is ready, Vercel deployment URLs are used automatically for metadata and structured data.

When the domain is ready:

- [ ] Connect the domain in Vercel and choose the canonical host.
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://final-domain.example`.
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` only on the public launch environment.
- [ ] Verify `/robots.txt` allows crawling.
- [ ] Verify `/sitemap.xml` contains the final domain and all artist routes.
- [ ] Verify canonical, Open Graph and JSON-LD URLs use the final domain.
- [ ] Test the social-sharing preview.
- [ ] Verify HTTPS and host redirects.

## v1.0 sign-off

- [ ] Production build passed from a clean checkout.
- [ ] Real-device test matrix passed.
- [ ] All public controls have real destinations or honest unavailable states.
- [ ] No placeholder copy remains that could mislead visitors.
- [ ] Release version changed from `0.9.x` to `1.0.0`.
