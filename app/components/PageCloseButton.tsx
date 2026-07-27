import Link from "next/link";

export function PageCloseButton() {
  return (
    <Link
      className="pageCloseButton"
      href="/#top"
      aria-label="Close this page and return to the Shams for Humanity homepage"
    >
      <span aria-hidden="true">×</span>
    </Link>
  );
}
