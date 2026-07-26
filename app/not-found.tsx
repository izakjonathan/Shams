import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "./components/ArrowIcon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="notFound" id="main-content" tabIndex={-1}>
      <p className="eyebrow">404</p>
      <h1>This page has wandered off.</h1>
      <p>The page you're looking for doesn't exist, or has moved.</p>
      <Link className="button buttonPrimary" href="/">
        Back to Shams for Humanity <ArrowIcon />
      </Link>
    </main>
  );
}
