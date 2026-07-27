"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowIcon } from "./components/ArrowIcon";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="errorState" id="main-content" tabIndex={-1}>
      <p className="eyebrow">Something went wrong</p>
      <h1>The sun slipped behind a cloud.</h1>
      <p>Please try loading this part of the site again.</p>
      <div className="errorStateActions">
        <button className="button buttonPrimary" type="button" onClick={reset}>
          Try again <ArrowIcon />
        </button>
        <Link className="textLink dark" href="/">
          Return home <ArrowIcon />
        </Link>
      </div>
    </main>
  );
}
