import type { Metadata } from "next";
import { ArrowIcon } from "./components/ArrowIcon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="notFound">
      <p className="eyebrow">404</p>
      <h1>This page has wandered off.</h1>
      <p>The page you're looking for doesn't exist, or has moved.</p>
      <a className="button buttonPrimary" href="/">
        Back to Shams for Humanity <ArrowIcon />
      </a>
    </main>
  );
}
