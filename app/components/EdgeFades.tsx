/**
 * Minimal mobile edge fades.
 *
 * The root canvas is yellow, while these very shallow fixed gradients soften
 * the hand-off between Safari's exposed browser-adjacent area and the page.
 * They never receive pointer input. The site header is layered above them;
 * page content, the mobile menu and the splash remain below them.
 */
export function EdgeFades() {
  return (
    <div className="edgeFades" aria-hidden="true">
      <span className="edgeFade edgeFadeTop" />
      <span className="edgeFade edgeFadeBottom" />
    </div>
  );
}
