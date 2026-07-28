# Shams for Humanity v1.6.4

## Lightweight artist morph transitions

This release keeps the v1.6.3 deterministic DOM/FLIP approach, but removes its largest remaining Safari and performance risk.

Artist navigation now builds a lightweight snapshot from only the route blocks that intersect the current viewport, with a small overscan area. It no longer clones and lays out the entire homepage or artist page. The selected artist title is isolated into a floating layer and animates by interpolating its measured position, dimensions and typography rather than stretching the letters with separate X/Y transforms.

Additional hardening:

- the snapshot receives an opaque paper canvas so Safari cannot expose a black or white backing surface through transparent document areas;
- only the selected artist title is hidden in the outgoing snapshot;
- the floating title remains below the fixed site header;
- the destination waits briefly for its priority portrait to decode, then waits for fonts and two stable layout frames;
- return focus can be applied to the artist row by making it temporarily programmatically focusable;
- the mobile menu and information-page black curtain remain unchanged.
