# Shams for Humanity v2.1.8

## Safari footer canvas permanence
This release fixes the remaining white area beneath the black footer on iOS Safari. The canvas now changes to black when the footer physically touches the bottom of the visual viewport, rather than waiting for unstable exact-document-end metrics.

A fixed black underlay is mounted behind the site only during footer contact. It does not alter layout or footer height and is completely removed from rendering elsewhere with `display:none`.

All v2.1.7 design, admin, content, animation, splash, menu, route-curtain, and accessibility behavior is preserved.
