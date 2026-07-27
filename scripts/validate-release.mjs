import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function parsePublicUrl(name, { required = false } = {}) {
  const raw = process.env[name]?.trim();
  if (!raw) {
    if (required) errors.push(`${name} is required.`);
    return undefined;
  }

  try {
    const url = new URL(raw);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
      errors.push(`${name} must use HTTPS (HTTP is allowed only for localhost).`);
    }
    if (url.username || url.password) {
      errors.push(`${name} must not contain embedded credentials.`);
    }
    return url;
  } catch {
    errors.push(`${name} is not a valid absolute URL.`);
    return undefined;
  }
}

const pkg = readJson("package.json");
if (pkg.version !== "1.1.2") {
  errors.push(`package.json version must be 1.1.2 for this release (found ${pkg.version}).`);
}

for (const path of [
  "app/error.tsx",
  "app/global-error.tsx",
  "RELEASE_CHECKLIST.md",
  ".env.example",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/accessibility/page.tsx",
  "app/contact/page.tsx",
]) {
  if (!existsSync(resolve(root, path))) errors.push(`Missing required release file: ${path}`);
}

const indexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING?.trim().toLowerCase() === "true";
const siteUrl = parsePublicUrl("NEXT_PUBLIC_SITE_URL", { required: indexing });
parsePublicUrl("NEXT_PUBLIC_TICKET_URL");
parsePublicUrl("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION");

if (indexing && siteUrl && siteUrl.hostname.endsWith(".vercel.app")) {
  warnings.push("Search indexing is enabled on a vercel.app URL. Confirm this is intentional.");
}
if (!process.env.NEXT_PUBLIC_TICKET_URL?.trim()) {
  warnings.push("NEXT_PUBLIC_TICKET_URL is not set; available ticket buttons will show “Tickets soon”.");
}
if (!process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION?.trim()) {
  warnings.push("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION is not set; newsletter signup remains disabled.");
}
if (!siteUrl) {
  warnings.push("NEXT_PUBLIC_SITE_URL is not set; metadata will use the current Vercel deployment URL or localhost.");
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log("Release configuration validation passed.");
