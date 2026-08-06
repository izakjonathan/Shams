import type { NextConfig } from "next";
import { safeExternalUrl } from "./app/lib/site";

// The newsletter form posts directly to an external provider, so its origin
// (only) needs a form-action allowance. Ticket links are plain <a> tags, not
// form submissions, so they aren't affected by CSP form-action.
function externalFormOrigin(): string | null {
  const action = safeExternalUrl(process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION);
  return action ? new URL(action).origin : null;
}

function contentSecurityPolicy(): string {
  const formActionOrigins = ["'self'", externalFormOrigin()].filter(Boolean).join(" ");

  return [
    "default-src 'self'",
    // 'unsafe-inline' is currently required by the pre-hydration splash gate,
    // framework-emitted inline styles, JSON-LD data blocks, and the few
    // component-level style attributes. No user-supplied HTML is rendered.
    // on this site. (A per-request nonce would remove this, but it would
    // also force every page into dynamic rendering, which is the wrong
    // trade-off for what is otherwise a fully static festival site.)
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    `form-action ${formActionOrigins}`,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy() },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["postgres"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
