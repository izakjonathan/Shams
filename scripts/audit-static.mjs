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

const base = readFileSync(resolve(root, "app/styles/base.css"), "utf8");
if (!/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*font-family:\s*var\(--font-display\)/s.test(base)) {
  errors.push("Semantic headings must use the global Agilera display-font control.");
}


const typography = readFileSync(resolve(root, "app/styles/typography.css"), "utf8");
for (const required of [
  "--leading-display-hero", "--leading-display-section",
  ".informationBody h2", ".artistHeroCopy h1", ".sectionHeading h2",
  "text-wrap: balance", "line-height: var(--leading-display-section)",
]) {
  if (!typography.includes(required)) errors.push(`Typography system is missing: ${required}`);
}
if (!globals.includes('styles/typography.css')) errors.push("Global typography stylesheet must be imported.");
if (/\.informationBody h2\s*\{[^}]*line-height:\s*(?:normal|1(?:\.2)?)/s.test(typography)) {
  errors.push("Information headings must use compact Agilera line-height controls.");
}

const information = readFileSync(resolve(root, "app/styles/information.css"), "utf8");
if (!information.includes(".informationPage") || !information.includes("background: var(--color-accent)")) {
  errors.push("Information routes must use the flat yellow page background.");
}
if (/informationHero[^}]*gradient|contactHero[^}]*gradient|organizerBlock[^}]*gradient/s.test(information)) {
  errors.push("Information and contact routes must not restore gradients.");
}

const closeButton = readFileSync(resolve(root, "app/components/PageCloseButton.tsx"), "utf8");
if (!closeButton.includes('href = "/#site-footer"') || !closeButton.includes("CrossIcon")) {
  errors.push("Information-page close control must return to the footer and use the custom cross icon.");
}
const closeStyles = readFileSync(resolve(root, "app/styles/close-control.css"), "utf8");
if (!closeStyles.includes("background: transparent") || !closeStyles.includes("border: 1px solid var(--color-ink)")) {
  errors.push("Close control must be an unfilled black circular outline.");
}

const footer = readFileSync(resolve(root, "app/components/SiteFooter.tsx"), "utf8");
if (!footer.includes('id="site-footer"')) errors.push("Footer must expose the site-footer destination anchor.");
const homepage = readFileSync(resolve(root, "app/styles/homepage.css"), "utf8");
if (!/\.siteFooter\s*\{[^}]*min-height:\s*100svh/s.test(homepage)) {
  errors.push("Footer must be at least one small viewport high.");
}
if (!routeFade.includes('hash === "#site-footer"') || !routeFade.includes("maximumScroll")) {
  errors.push("Route controller must position footer returns at the document maximum scroll.");
}

const programmeComponent = readFileSync(resolve(root, "app/components/ProgrammeExplorer.tsx"), "utf8");
const programmeTickets = readFileSync(resolve(root, "app/styles/programme-tickets.css"), "utf8");
const programmeContent = readFileSync(resolve(root, "app/lib/content/programme.ts"), "utf8");
if (!programmeComponent.includes("programmeEntryTime") || programmeComponent.includes("programmeEntryNumber")) {
  errors.push("Programme entries must render editorial times instead of ordinal numbers.");
}
for (const required of ["readonly id: string", "readonly sortOrder: number", "data-content-id", "data-content-status"]) {
  if (!(programmeComponent + programmeContent).includes(required)) errors.push(`Programme CMS preparation is missing: ${required}`);
}

const splash = readFileSync(resolve(root, "app/components/SplashScreen.tsx"), "utf8");
const splashStyles = readFileSync(resolve(root, "app/styles/splash.css"), "utf8");
if (!splash.includes("splash-humanity-artwork.jpeg")) errors.push("Splash must use the supplied humanity artwork.");
if (!splashStyles.includes("background: transparent") || !splashStyles.includes("min-height: 100svh") || !splashStyles.includes("height: 100dvh")) {
  errors.push("Splash must cover the full safe viewport on a transparent overlay.");
}
for (const required of ["splashCanvasActive", "background-image: url(\"/images/splash-humanity-artwork.jpeg\")", "background-size: cover"]) {
  if (!splashStyles.includes(required)) errors.push(`Safari splash canvas integration is missing: ${required}`);
}
const layout = readFileSync(resolve(root, "app/layout.tsx"), "utf8");
if (!layout.includes("splashCanvasActive") || !layout.includes("shf-splash-seen-v1.7.6")) {
  errors.push("Root layout must activate the splash document canvas and use the current session key.");
}
if (!splash.includes('root.classList.remove("splashCanvasActive")')) {
  errors.push("Splash must remove the document artwork canvas after completion.");
}
if (!/\.splashScreen\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0/s.test(splashStyles)) {
  errors.push("First-visit splash base styles must define a fixed full-viewport overlay.");
}
if (/html\.splashSessionSeen\s+\.splashScreen\s*\{[^}]*position:\s*fixed/s.test(splashStyles)) {
  errors.push("Splash base geometry must not be scoped to the repeat-visit session class.");
}
if (!/html\.splashSessionSeen\s+\.splashScreen\s*\{[^}]*display:\s*none\s*!important/s.test(splashStyles)) {
  errors.push("Repeat visits must suppress the server-rendered splash before hydration.");
}
if (!splash.includes('markSplashSeen();\n        root.classList.add("splashSessionSeen")')) {
  errors.push("The splash session flag must be written only after the first sequence completes.");
}
if (splashStyles.includes("splashScreenArtWrap::before") || splashStyles.includes("splashScreenArtWrap::after")) {
  errors.push("Legacy splash gradient overlays must not remain.");
}

// v1.7.6 centralized theme and gradient architecture.
const themeSource = readFileSync(resolve(root, "app/theme.json"), "utf8");
const generatedTheme = readFileSync(resolve(root, "app/theme.generated.css"), "utf8");
const designSystem = readFileSync(resolve(root, "app/design-system.css"), "utf8");
const gradients = readFileSync(resolve(root, "app/styles/gradients.css"), "utf8");
const homepageStyles = readFileSync(resolve(root, "app/styles/homepage.css"), "utf8");
const artistStyles = readFileSync(resolve(root, "app/styles/artists.css"), "utf8");

for (const required of ["paper", "ink", "accent", "white", "dark", "ticketDark"]) {
  if (!themeSource.includes(`"${required}"`)) errors.push(`Theme source is missing palette key: ${required}`);
}
if (!globals.startsWith('@import "./theme.generated.css";')) {
  errors.push("Generated theme stylesheet must be imported first.");
}
for (const required of ["--color-paper-rgb", "--color-accent-rgb", "--paper-orb-gradient", "--dark-orb-gradient"]) {
  if (!generatedTheme.includes(required)) errors.push(`Generated theme is missing: ${required}`);
}
if (designSystem.includes("--color-paper:") || designSystem.includes("--paper-orb-gradient:")) {
  errors.push("Palette and gradient colour recipes must not be duplicated in design-system.css.");
}
if (/gradient\(/.test(homepageStyles) || /gradient\(/.test(artistStyles)) {
  errors.push("Homepage and artist component styles must not define gradients directly.");
}
for (const required of [".hero {", ".artistHero .glowOne", ".artistSet .glowOne", ".artistPortrait::after {"]) {
  if (!gradients.includes(required)) errors.push(`Central gradient geometry is missing: ${required}`);
}
if (/rgba\(252,\s*198,\s*79/.test(gradients)) {
  errors.push("Gradient colours must derive from --color-accent-rgb rather than hard-coded accent values.");
}
if (!readFileSync(resolve(root, "package.json"), "utf8").includes('"theme:generate"')) {
  errors.push("Package scripts must expose theme generation.");
}


// v1.7.8 programme filter rail must remain swipeable without visual fade or scrollbar chrome.
if (/\.programmeFilters\s*\{[^}]*background\s*:/s.test(gradients)) {
  errors.push("Programme filter rail must not have a right-edge background gradient.");
}
if (!programmeTickets.includes("scrollbar-width: none") || !programmeTickets.includes(".programmeFilters::-webkit-scrollbar") || !programmeTickets.includes("display: none")) {
  errors.push("Programme filter rail must hide native scrollbars across Firefox and WebKit.");
}
if (!programmeTickets.includes("overflow-x: auto") || !programmeTickets.includes("overflow-y: hidden")) {
  errors.push("Programme filter rail must retain horizontal scrolling while suppressing vertical overflow.");
}

// v1.7.9 all gradient controls stay centralized while the approved hero composition remains protected.
for (const required of [
  "--gradient-size:", "--gradient-shape-x:", "--gradient-shape-y:",
  "--gradient-strength:", "--gradient-rotation:",
  "--gradient-layer-1-w:", "--gradient-layer-2-w:", "--gradient-layer-3-w:",
  "--hero-wash-1:", "--hero-layer-1-w:", "--hero-layer-2-w:", "--hero-layer-3-w:",
  "--dark-gradient-size:", "--dark-gradient-shape-x:", "--dark-gradient-strength:",
  "background-image: var(--gradient-wash-1), var(--gradient-wash-2), var(--gradient-wash-3)",
  "background-image: var(--hero-wash-1), var(--hero-wash-2), var(--hero-wash-3)",
]) {
  if (!gradients.includes(required)) errors.push(`Centralized gradient control is missing: ${required}`);
}
for (const selector of [".statement", ".lineup", ".programme", ".faq", ".artistHero", ".artistSet"]) {
  const match = gradients.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`, "s"));
  if (match && /--(?:section-)?glow-(?:[123]-)?(?:w|h|scale-x|scale-y|opacity|rotate)/.test(match[1])) {
    errors.push(`${selector} must not own independent gradient size/shape controls.`);
  }
}
if (/\.hero\s*\{[^}]*radial-gradient/s.test(gradients)) {
  errors.push("Hero gradient recipes must be variables in the centralized :root control block.");
}
for (const required of [
  "--glow-w: var(--hero-layer-1-w)", "--glow-h: var(--hero-layer-1-h)",
  "--glow-w: var(--hero-layer-2-w)", "--glow-h: var(--hero-layer-2-h)",
  "--glow-w: var(--hero-layer-3-w)", "--glow-h: var(--hero-layer-3-h)",
]) {
  if (!gradients.includes(required)) errors.push(`Hero orb geometry is not centralized: ${required}`);
}
if (/\.hero \.orbOne,\s*\.statement/s.test(gradients)) {
  errors.push("Hero placement must not be grouped with paper-section placement; that regression breaks the approved hero composition.");
}
if (/\.artistQuote \.darkGlowOne\s*\{[^}]*--glow-(?:w|h|opacity)/s.test(artistStyles)) {
  errors.push("Artist quote dark-gradient size/strength must be controlled globally in gradients.css.");
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");

