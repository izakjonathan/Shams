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
for (const required of ["WATCHDOG_MS", "MORPH_WATCHDOG_MS", "createMorphLayer", "scrollRestoration", "aria-busy", "router.prefetch", "routeTransitionActive", "manualArtistMorphActive", "routeTransitionVeil"]) {
  if (!routeFade.includes(required)) errors.push(`RouteFade is missing required hardening: ${required}`);
}


if (!routeFade.includes('data-live-route')) errors.push("RouteFade must mark the live route explicitly.");
if (!routeFade.includes('createViewportSnapshot')) errors.push("Artist morph must create a viewport-only snapshot.");
if (routeFade.includes('route.cloneNode(true)')) errors.push("Artist morph must not clone the entire live route.");
if (!routeFade.includes('intersectsViewport')) errors.push("Viewport snapshot must prune off-screen content.");
if (!routeFade.includes('waitForStableDestinationLayout')) errors.push("Artist morph must wait for fonts and stable layout before measuring its destination.");
if (!routeFade.includes('shf-route-target')) errors.push("RouteFade must coordinate the destination hash with ScrollReveal.");

const viewTransitions = readFileSync(resolve(root, "app/styles/view-transitions.css"), "utf8");
for (const required of ["routeTransitionVeil", "data-route-phase", "route-panel-duration", "artistMorphSnapshot", "artistMorphFloatingTitle", "manualArtistMorphActive", "prefers-reduced-motion"]) {
  if (!viewTransitions.includes(required)) errors.push(`View transition stylesheet is missing: ${required}`);
}


if (/:root\.manualArtistMorphActive\s+\.routeFade\s*\{[^}]*opacity\s*:\s*0/s.test(viewTransitions)) {
  errors.push("Artist morph CSS must not hide every .routeFade, including the snapshot clone.");
}
if (!viewTransitions.includes(':root.manualArtistMorphActive [data-live-route]')) {
  errors.push("Artist morph CSS must target only the marked live route.");
}
if (!viewTransitions.includes('.artistMorphSnapshotBlock')) {
  errors.push("Artist morph snapshot blocks need an isolated class.");
}
if (viewTransitions.includes('z-index: 70')) errors.push("Floating morph title must remain below the fixed header.");

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");
