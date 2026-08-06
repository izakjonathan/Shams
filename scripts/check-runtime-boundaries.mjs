import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = process.cwd();
const errors = [];
const clientUnsafe = [
  'from "next/headers"',
  "from 'next/headers'",
  'from "../db/client"',
  'from "../../db/client"',
  'from "postgres"',
  "from 'postgres'",
  'import "server-only"',
  "import 'server-only'",
];

function filesIn(directory) {
  const result = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) result.push(...filesIn(path));
    else if (/\.(?:ts|tsx|js|mjs)$/.test(name)) result.push(path);
  }
  return result;
}

for (const path of filesIn(resolve(root, "app"))) {
  const source = readFileSync(path, "utf8");
  const label = relative(root, path);
  if (/^["']use client["'];/m.test(source)) {
    for (const pattern of clientUnsafe) {
      if (source.includes(pattern)) {
        errors.push(`${label} is a Client Component but contains server-only import: ${pattern}`);
      }
    }
    if (/from ["'][^"']*content\/server["']/.test(source)) {
      errors.push(`${label} must not import app/content/server.`);
    }
  }
}

const sharedIndex = readFileSync(resolve(root, "app/content/index.ts"), "utf8");
for (const forbidden of ["public-repository", "database-public-records", "./server", "../db/"]) {
  if (sharedIndex.includes(forbidden)) {
    errors.push(`app/content/index.ts exposes server-only content through the shared barrel: ${forbidden}`);
  }
}

const metadataFiles = ["app/manifest.ts", "app/sitemap.ts", "app/opengraph-image.tsx", "app/layout.tsx"];
for (const file of metadataFiles) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (/content\/server|publicContentRepository|database-public-records|db\/client/.test(source)) {
    errors.push(`${file} must remain independent of database/server request content.`);
  }
}

const nodePages = [
  "app/page.tsx",
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/accessibility/page.tsx",
  "app/contact/page.tsx",
  "app/artists/[slug]/page.tsx",
  "app/admin/layout.tsx",
  "app/api/preview/route.ts",
  "app/api/preview/exit/route.ts",
];
for (const file of nodePages) {
  const source = readFileSync(resolve(root, file), "utf8");
  if (!source.includes('export const runtime = "nodejs";')) {
    errors.push(`${file} must declare the Node.js runtime.`);
  }
}

const nextConfig = readFileSync(resolve(root, "next.config.ts"), "utf8");
if (!nextConfig.includes('serverExternalPackages: ["postgres"]')) {
  errors.push('next.config.ts must externalize the Node-only "postgres" package.');
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}
console.log("Runtime-boundary audit passed.");
