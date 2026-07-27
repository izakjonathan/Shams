"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "32px",
          boxSizing: "border-box",
          background: "#f5f2eb",
          color: "#090909",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <main style={{ maxWidth: "640px" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Shams for Humanity
          </p>
          <h1 style={{ fontSize: "clamp(40px, 10vw, 88px)", lineHeight: 0.95 }}>
            Something went wrong.
          </h1>
          <p>Please reload this part of the site.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "24px",
              minHeight: "52px",
              padding: "0 24px",
              border: "1px solid #090909",
              background: "#090909",
              color: "#fff",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
