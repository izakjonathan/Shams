import { FadeLink } from "./FadeLink";

interface PageCloseButtonProps {
  readonly href?: string;
  readonly label?: string;
  readonly className?: string;
}

export function PageCloseButton({
  href = "/#top",
  label = "Close this page and return to the Shams for Humanity homepage",
  className = "",
}: PageCloseButtonProps) {
  return (
    <FadeLink
      className={`pageCloseButton${className ? ` ${className}` : ""}`}
      href={href}
      aria-label={label}
    >
      <span aria-hidden="true">×</span>
    </FadeLink>
  );
}
