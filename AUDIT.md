# v1.8.3 Safari Liquid Glass Audit

## Root canvas

- `viewport-fit=cover` remains enabled.
- `html` and `body` use `--document-canvas-color` with an immediate paper fallback.
- No repeat-visit or splash state makes the root transparent.
- Splash tinting uses `--safari-splash-color`, not `theme-color` or a root background image.
- `DocumentCanvasTone` remains responsible for matching the section touching the bottom viewport edge after splash completion.

## Splash

- Artwork is rendered as real fixed media and bleeds 72 px above and 160 px below the viewport.
- The runway offset is 62 px and is applied only after detecting mobile touch Safari.
- No global runway or permanent coordinate offset exists.
- Body scrolling is not locked.
- The splash layer itself blocks touch gestures.
- The live site is inert and aria-hidden during the splash.
- The runway is removed and scroll is reset while the splash is still opaque.
- The paper canvas and live site are painted for two frames before the dissolve starts.

## Fixed and sticky elements

- Site header has no background colour or backdrop filter.
- Mobile menu is absent from the DOM while closed.
- Route curtain is absent from the DOM while idle.
- Close-button visuals are on an absolute child of a transparent fixed wrapper.

## Regression protection

The static audit rejects transparent root states, a body splash scroll lock, persistent hidden route curtains, root splash background images, missing media bleed, missing dynamic runway activation, missing shell inert handling, and fixed close-button visuals placed directly on the fixed wrapper.
