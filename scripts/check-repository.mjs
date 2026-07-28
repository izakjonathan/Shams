import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = process.cwd();
const errors = [];
const sourceExtensions = new Set([".ts", ".tsx", ".css", ".mjs"]);
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (["node_modules", ".next", ".git"].includes(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (sourceExtensions.has(extname(path))) files.push(path);
  }
}

walk(resolve(root, "app"));
walk(resolve(root, "scripts"));
const ownPath = resolve(root, "scripts/check-repository.mjs");
const combined = files.filter((path) => path !== ownPath).map((path) => readFileSync(path, "utf8")).join("\n");

for (const obsolete of ["ArtistCard", "artistCard", "StatusLabel", "statusLabel", "ContentStatus", "./status", "ticket.available"]) {
  if (combined.includes(obsolete)) errors.push(`Obsolete implementation remains: ${obsolete}`);
}

const cssCombined = files
  .filter((path) => extname(path) === ".css")
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");
if (cssCombined.includes("scroll-behavior: smooth")) {
  errors.push("Global smooth scrolling must not be reintroduced; same-page scrolling is controlled in RouteFade.");
}

for (const required of [
  "app/components/FadeLink.tsx",
  "app/components/RouteFade.tsx",
  "app/components/SiteHeader.tsx",
  "app/styles/motion.css",
]) {
  if (!existsSync(resolve(root, required))) errors.push(`Missing transition file: ${required}`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`Repository quality checks passed across ${files.length} source files.`);
