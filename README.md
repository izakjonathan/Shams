# Shams for Humanity v1.6.2

## Deterministic artist morph transitions

This release replaces the browser-native root View Transition used by artist routes with a deterministic DOM/FLIP morph. The outgoing page remains visibly cloned while Next.js loads the artist destination. The selected artist title moves from its measured source position into the destination heading while the old page dissolves and the new page appears beneath it.

The mobile menu and information-page black curtain remain unchanged.
