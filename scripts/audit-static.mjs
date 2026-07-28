import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const errors = [];
const textFiles = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(?:ts|tsx|css|md|mjs|json)$/.test(path)) textFiles.push(path);
  }
}

walk(resolve(root, "app"));

const joined = textFiles.map((path) => readFileSync(path, "utf8")).join("\n");
for (const obsolete of ["ArtistCard", "artistCard", "StatusLabel", "statusLabel", "artistLoading"]) {
  if (joined.includes(obsolete)) errors.push(`Obsolete system remains referenced: ${obsolete}`);
}

const globals = readFileSync(resolve(root, "app/globals.css"), "utf8");
if (globals.indexOf('responsive.css') < globals.indexOf('artists.css')) {
  errors.push("responsive.css must be imported after page/component styles.");
}

const routeFade = readFileSync(resolve(root, "app/components/RouteFade.tsx"), "utf8");
for (const required of ["WATCHDOG_MS", "ARTIST_WATCHDOG_MS", "startViewTransition", "scrollRestoration", "aria-busy", "router.prefetch", "routeTransitionActive", "artistMorphActive", "routeTransitionVeil"]) {
  if (!routeFade.includes(required)) errors.push(`RouteFade is missing required hardening: ${required}`);
}

const viewTransitions = readFileSync(resolve(root, "app/styles/view-transitions.css"), "utf8");
for (const required of ["routeTransitionVeil", "data-route-phase", "route-panel-duration", "artist-morph-title", "artist-morph-image", "prefers-reduced-motion"]) {
  if (!viewTransitions.includes(required)) errors.push(`View transition stylesheet is missing: ${required}`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");
