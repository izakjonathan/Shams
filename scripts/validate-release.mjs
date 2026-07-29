import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function readText(path) {
  return readFileSync(resolve(root, path), "utf8");
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
    if (url.username || url.password) errors.push(`${name} must not contain embedded credentials.`);
    return url;
  } catch {
    errors.push(`${name} is not a valid absolute URL.`);
    return undefined;
  }
}

const pkg = readJson("package.json");
if (pkg.version !== "1.7.3") {
  errors.push(`package.json version must be 1.7.3 for this release (found ${pkg.version}).`);
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
  "app/components/ArtistNavigation.tsx",
  "app/components/SectionHeader.tsx",
  "app/components/ProgrammeExplorer.tsx",
  "app/components/TicketSection.tsx",
  "app/styles/programme-tickets.css",
  "app/styles/components.css",
  "app/styles/view-transitions.css",
  "app/components/RouteFade.tsx",
  "app/components/FadeLink.tsx",
  "scripts/audit-static.mjs",
]) {
  if (!existsSync(resolve(root, path))) errors.push(`Missing required release file: ${path}`);
}

const indexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING?.trim().toLowerCase() === "true";
const siteUrl = parsePublicUrl("NEXT_PUBLIC_SITE_URL", { required: indexing });
parsePublicUrl("NEXT_PUBLIC_TICKET_URL");
parsePublicUrl("NEXT_PUBLIC_NEWSLETTER_FORM_ACTION");

if (indexing && siteUrl?.hostname.endsWith(".vercel.app")) {
  warnings.push("Search indexing is enabled on a vercel.app URL. Confirm this is intentional.");
}

if (indexing) {
  const launchFiles = [
    "app/contact/page.tsx",
    "app/privacy/page.tsx",
    "app/accessibility/page.tsx",
    "app/lib/content/event.ts",
  ];
  const draftPattern = /(?:@[^\s"']+\.example\b|to be confirmed|address to be confirmed|replace this address before publication)/i;
  for (const path of launchFiles) {
    if (draftPattern.test(readText(path))) {
      errors.push(`Indexing cannot be enabled while draft public information remains in ${path}.`);
    }
  }
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
if (!existsSync(resolve(root, "package-lock.json"))) {
  warnings.push("package-lock.json is not present. Generate and commit it before switching deployment installs to npm ci.");
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log("Release configuration validation passed.");
