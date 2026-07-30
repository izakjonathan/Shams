# v2.1.8 permanent Safari footer-canvas audit

## Root cause
The previous implementation locked the canvas to black only when the mathematical document bottom was reached. iOS Safari changes `visualViewport.height`, toolbar geometry, and native chrome independently. The footer could visibly touch the toolbar while both document-end calculations remained a few pixels short, leaving the paper canvas visible as a white strip.

## Resolution
- Detect footer contact directly from `#site-footer.getBoundingClientRect()` against `visualViewport.height`.
- Retain exact document-bottom detection as a secondary safeguard.
- Force literal dark backgrounds on both `html` and `body` while footer contact is active.
- Add a conditionally rendered fixed black underlay behind the site shell. It is `display:none` outside footer state and never contributes to document height.
- Keep the footer itself at one viewport; no flow bleed, spacer, pseudo-content below the footer, or extra scroll distance is introduced.
- Use the maximum of body and root scroll heights for the secondary bottom check.

## Regression guards
The static audit now requires footer-contact geometry detection, the non-layout conditional underlay, and rejects reintroduction of flow-based footer bleed.

## Validation
- Release validation passed.
- Static architecture audit passed.
- Validation scripts parse under Node.
- CSS braces and ZIP integrity checked.
