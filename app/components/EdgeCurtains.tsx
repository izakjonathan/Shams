/**
 * Fixed decorative edge curtains for mobile Safari.
 *
 * The browser/root canvas stays yellow. These non-interactive layers continue
 * that yellow into the page with a soft curved fade, so page content, the
 * splash screen, and the full-screen menu visually pass underneath the edges.
 * The site header is intentionally layered above the top curtain.
 */
export function EdgeCurtains() {
  return (
    <div className="edgeCurtains" aria-hidden="true">
      <div className="edgeCurtain edgeCurtainTop" />
      <div className="edgeCurtain edgeCurtainBottom" />
    </div>
  );
}
