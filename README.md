# Shams for Humanity v2.1.4

Animation and runtime optimization release based on v2.1.1.

## Main improvements

- Shared motion helpers for reduced-motion detection, CSS duration parsing and painted-frame scheduling.
- Route curtain state is local to the mounted transition elements rather than written to the document root.
- Route, menu and splash recovery timers derive from CSS tokens.
- iOS canvas sampling is coalesced and no longer runs on unrelated engines.
- Splash and menu double-rAF implementations are consolidated.
- Faster, more responsive splash, reveal and interaction timing.
- Static audit ordering and false-positive checks corrected.
- Stale build artifact removed.

The public design, admin/database foundation, typed content architecture, Safari splash runway, footer bleed and editorial curtain visual treatment are preserved.

See `AUDIT.md` for the complete review.

## v2.1.4 UX integration

This release selectively merges the safe UX improvements from the separate UX pass into the optimized v2.1.3 baseline. It adds accessible new-tab announcements for artist and ticket links, a programme empty state, clickable email addresses with clearer hover affordance, larger mobile artist navigation targets, and slightly stronger muted-text contrast. Authentication, motion utilities, Safari canvas handling, splash timing, route-curtain lifecycle, menu compositor hardening, versioning, and audit architecture remain from the current optimized baseline.
