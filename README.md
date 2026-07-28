# Shams for Humanity v1.6.1

## Artist morph compositor fix

This build keeps the mobile menu transition unchanged and repairs the artist morph transition. The v1.6.0 root snapshots faded simultaneously over an intentionally transparent Safari document canvas, exposing the browser compositor's black backing layer. v1.6.1 keeps the outgoing root opaque while the destination dissolves above it, forces an opaque paper canvas only while the morph is active, and limits portrait matching to artist-to-artist navigation.

Artist home/open/close navigation now morphs the artist title without a black interstitial. Information pages continue to use the menu-style black curtain.
