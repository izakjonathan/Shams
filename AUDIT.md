# v2.5.0 stable visual-restoration audit

- Built from the confirmed stable v2.4.9 initial-paint baseline.
- Startup scroll guards and initial-load `scrollTo()` mutations remain absent.
- Global gradient size is restored to 1.5.
- Gradient strength remains 1.2.
- Gradient enlargement uses direct width/height geometry and wash overscan only.
- No `scale(var(--gradient-size))` transform is used.
- Hero blur remains disabled.
- Splash remains a single opacity dissolve.
- Route, menu, footer canvas, database, preview, and admin systems are unchanged.
