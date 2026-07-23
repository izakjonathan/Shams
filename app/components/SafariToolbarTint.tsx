/**
 * iOS Safari 26 toolbar tint sentinels.
 *
 * WebKit samples qualifying fixed elements close to the visual viewport edges
 * when extending page color beneath its translucent browser controls. These
 * narrow strips provide one intentional, stable sampling source so opening the
 * full-screen menu cannot replace the top tint with the menu's black surface.
 *
 * The bottom sentinel is only displayed while the existing edge controller has
 * confirmed that the document is at its real bottom boundary.
 */
export function SafariToolbarTint() {
  return (
    <div className="safariToolbarTints" aria-hidden="true">
      <span className="safariToolbarTint safariToolbarTintTop" />
      <span className="safariToolbarTint safariToolbarTintBottom" />
    </div>
  );
}
