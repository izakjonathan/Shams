import { CrossIcon } from "./CrossIcon";
import { FadeLink } from "./FadeLink";

interface PageCloseButtonProps {
  readonly href?: string;
  readonly label?: string;
  readonly className?: string;
}

export function PageCloseButton({
  href = "/#site-footer",
  label = "Close this page and return to the bottom of the Shams for Humanity homepage",
  className = "",
}: PageCloseButtonProps) {
  return (
    <FadeLink
      className={`pageCloseButton${className ? ` ${className}` : ""}`}
      href={href}
      transitionKind={href.startsWith("/#artist-") ? "artist-close" : "page-close"}
      aria-label={label}
    >
      <CrossIcon />
    </FadeLink>
  );
}
