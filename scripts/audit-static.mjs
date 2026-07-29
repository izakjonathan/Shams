import { readFileSync, readdirSync, statSync } from "node:fs";
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

for (const obsolete of [
  "ArtistCard", "artistCard", "StatusLabel", "statusLabel", "artistLoading",
  "manualArtistMorphActive", "artistMorphSnapshot", "artistMorphFloatingTitle",
  "createMorphLayer", "createViewportSnapshot", "MORPH_WATCHDOG_MS",
  "data-artist-morph", "data-artist-page-shell", "startViewTransition",
]) {
  if (joined.includes(obsolete)) errors.push(`Obsolete system remains referenced: ${obsolete}`);
}

const globals = readFileSync(resolve(root, "app/globals.css"), "utf8");
if (globals.indexOf("responsive.css") < globals.indexOf("artists.css")) {
  errors.push("responsive.css must be imported after page/component styles.");
}

const routeFade = readFileSync(resolve(root, "app/components/RouteFade.tsx"), "utf8");
for (const required of [
  "WATCHDOG_MS", "scrollRestoration", "aria-busy", "router.prefetch",
  "routeTransitionActive", "routeTransitionVeil", "onTransitionEnd",
  "waitForDestinationLayout", "shf-route-target", "navigationStartedRef",
]) {
  if (!routeFade.includes(required)) errors.push(`RouteFade is missing required hardening: ${required}`);
}
if (!routeFade.includes('data-live-route')) errors.push("RouteFade must explicitly mark the live route.");
if (!routeFade.includes('router.push(pending.href, { scroll: false })')) errors.push("Route changes must disable automatic Next.js scrolling.");
if (!routeFade.includes('event.propertyName !== "transform"')) errors.push("Curtain lifecycle must react only to transform transition completion.");

const transitions = readFileSync(resolve(root, "app/styles/view-transitions.css"), "utf8");
for (const required of [
  "routeTransitionVeil", "data-route-phase", "route-curtain-open-duration",
  "route-curtain-close-duration", "route-curtain-switch-duration",
  "route-curtain-reveal-duration", "prefers-reduced-motion", "translate3d(0, -101%, 0)",
]) {
  if (!transitions.includes(required)) errors.push(`Editorial curtain stylesheet is missing: ${required}`);
}
if (/\[data-live-route\][^{]*\{[^}]*opacity\s*:/s.test(transitions)) {
  errors.push("Editorial curtain must not fade the live route.");
}
if (/\[data-live-route\][^{]*\{[^}]*transform\s*:/s.test(transitions)) {
  errors.push("Editorial curtain must not move or scale the live route.");
}
if (!transitions.includes("z-index: 45")) errors.push("Curtain must remain below the fixed site header.");

const fadeLink = readFileSync(resolve(root, "app/components/FadeLink.tsx"), "utf8");
if (fadeLink.includes("morphSource")) errors.push("FadeLink still passes obsolete morph source data.");

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");
