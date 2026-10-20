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
if (pkg.version !== "2.10.21") {
  errors.push(`package.json version must be 2.10.21 for this release (found ${pkg.version}).`);
}

for (const path of [
  "src/app/error.tsx",
  "src/app/global-error.tsx",
  "RELEASE_CHECKLIST.md",
  ".env.example",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/accessibility/page.tsx",
  "src/app/contact/page.tsx",
  "src/features/site/components/ArtistNavigation.tsx",
  "src/components/SectionHeader.tsx",
  "src/features/site/components/ProgrammeExplorer.tsx",
  "src/features/site/components/TicketSection.tsx",
  "src/features/site/components/EventGallery.tsx",
  "src/app/admin/gallery/page.tsx",
  "src/features/content/admin-validation.ts",
  "src/features/content/cache-tags.ts",
  "src/features/content/data/gallery.ts",
  "src/styles/gallery.css",
  "src/styles/programme-tickets.css",
  "src/styles/components.css",
  "src/styles/route-curtain.css",
  "src/styles/footer.css",
  "src/lib/viewport.ts",
  "src/lib/motion.ts",
  "src/features/site/components/RouteFade.tsx",
  "src/components/FadeLink.tsx",
  "scripts/audit-static.mjs",
  "scripts/generate-theme.mjs",
  "src/styles/theme.json",
  "src/styles/theme.generated.css",
  "playwright.config.ts",
  "tests/e2e/splash.spec.ts",
  "tests/e2e/public-navigation.spec.ts",
  "tests/e2e/accessibility-motion.spec.ts",
  "tests/e2e/admin.spec.ts",
  "tests/visual/approved-surfaces.spec.ts",
  "scripts/verify-release.mjs",
  ".github/workflows/quality.yml",
  "DEPLOYMENT_RUNBOOK.md",
  "DATABASE_GITHUB_ACTIONS.md",
  "scripts/db-common.mjs",
  "scripts/db-migrate.mjs",
  "scripts/db-verify.mjs",
  "scripts/db-seed.mjs",
  "scripts/db-seed-data.json",
  ".github/workflows/database-migrate.yml",
  ".github/workflows/database-verify.yml",
  ".github/workflows/database-seed.yml",
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
    "src/features/content/admin-validation.ts",
  "CHANGELOG.md",
  "QA_MATRIX.md",
  "src/features/content/data/contact.ts",
    "src/features/content/data/information-pages.ts",
    "src/features/content/data/event.ts",
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
