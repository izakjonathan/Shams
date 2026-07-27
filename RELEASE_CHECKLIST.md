# Shams for Humanity — v1.1.0 release record

The accepted v1.0.0 baseline has been extended into v1.1.0 with artist and information-page systems. This document remains the operational verification record for redeployments and the later custom-domain launch.

## Deployment checks

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
- [ ] Replace placeholder artist biographies, artwork and external links with approved material.
- [ ] Configure `NEXT_PUBLIC_TICKET_URL` and complete a real checkout-link test.
- [ ] Configure `NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` and complete a real form submission test.
- [ ] Add final Instagram, Facebook and contact destinations.
- [ ] Review and finalize the draft Privacy, Terms, Accessibility and Contact pages with confirmed organizer/provider details.

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

## v1.1.0 release status

- [ ] Production build passed from a clean checkout.
- [ ] Real-device test matrix passed.
- [ ] All public controls have real destinations or honest unavailable states.
- [ ] No placeholder copy remains that could mislead visitors.
- [x] Release version changed from `1.0.0` to `1.1.0`.
