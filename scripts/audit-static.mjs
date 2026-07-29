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
  "routeTransitionVeil", "onTransitionEnd",
  "waitForDestinationLayout", "shf-route-target", "navigationStartedRef",
]) {
  if (!routeFade.includes(required)) errors.push(`RouteFade is missing required hardening: ${required}`);
}
if (!routeFade.includes('data-live-route')) errors.push("RouteFade must explicitly mark the live route.");
if (!routeFade.includes('router.push(pending.href, { scroll: false })')) errors.push("Route changes must disable automatic Next.js scrolling.");
if (!routeFade.includes('event.propertyName !== "transform"')) errors.push("Curtain lifecycle must react only to transform transition completion.");

const transitions = readFileSync(resolve(root, "app/styles/route-curtain.css"), "utf8");
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
if (!closeStyles.includes(".pageCloseButtonVisual") || !closeStyles.includes("border: 1px solid var(--color-ink)")) {
  errors.push("Close control visuals must live on an absolute child with an unfilled black circular outline.");
}
if (!/\.pageCloseButton\s*\{[^}]*position:\s*fixed[^}]*border:\s*0[^}]*background:\s*transparent/s.test(closeStyles)) {
  errors.push("The fixed close-control wrapper must remain visually transparent for Safari tint isolation.");
}

const footer = readFileSync(resolve(root, "app/components/SiteFooter.tsx"), "utf8");
if (!footer.includes('id="site-footer"')) errors.push("Footer must expose the site-footer destination anchor.");
const homepage = readFileSync(resolve(root, "app/styles/homepage.css"), "utf8");
const footerStyles = readFileSync(resolve(root, "app/styles/footer.css"), "utf8");
if (!/\.siteFooter\s*\{[^}]*min-height:\s*100svh/s.test(footerStyles)) {
  errors.push("Footer must be at least one small viewport high.");
}
if (!routeFade.includes('hash === "#site-footer"') || !routeFade.includes("scrollToDocumentBottom")) {
  errors.push("Route controller must position footer returns at the document maximum scroll.");
}


if (/\.siteFooter\s*\{/.test(homepage) || /\.siteFooter\s*\{/.test(information)) {
  errors.push("Global footer geometry must live only in footer.css.");
}
const programmeComponent = readFileSync(resolve(root, "app/components/ProgrammeExplorer.tsx"), "utf8");
const programmeTickets = readFileSync(resolve(root, "app/styles/programme-tickets.css"), "utf8");
const programmeContent = readFileSync(resolve(root, "app/content/data/programme.ts"), "utf8");
const contentModels = readFileSync(resolve(root, "app/content/models.ts"), "utf8");
if (!programmeComponent.includes("programmeEntryTime") || programmeComponent.includes("programmeEntryNumber")) {
  errors.push("Programme entries must render editorial times instead of ordinal numbers.");
}
for (const required of ["readonly id: string", "readonly sortOrder: number", "data-content-id", "data-content-status"]) {
  if (!(programmeComponent + programmeContent + contentModels).includes(required)) errors.push(`Programme CMS preparation is missing: ${required}`);
}

const splash = readFileSync(resolve(root, "app/components/SplashScreen.tsx"), "utf8");
const splashStyles = readFileSync(resolve(root, "app/styles/splash.css"), "utf8");
if (!splash.includes("splash-humanity-artwork.jpeg")) errors.push("Splash must use the supplied humanity artwork.");
if (!splashStyles.includes("background-color: transparent") || !splashStyles.includes("min-height: 100svh") || !splashStyles.includes("height: 100dvh")) {
  errors.push("Splash overlay must cover the full safe viewport while its wrapper remains visually transparent.");
}
for (const required of [
  "--safari-splash-color", "--safari-splash-top-bleed", "--safari-splash-bottom-bleed",
  "--safari-splash-scroll-offset", "splashRunwayActive", "overflow-y: scroll",
  "top: calc(-1 * var(--safari-splash-top-bleed))",
  "bottom: calc(-1 * var(--safari-splash-bottom-bleed))",
]) {
  if (!splashStyles.includes(required)) errors.push(`Safari splash viewport hardening is missing: ${required}`);
}
if (/html\.splashCanvasActive[\s\S]*background-image:\s*url\(/.test(splashStyles)) {
  errors.push("Safari splash tinting must use an explicit sampled root colour, not a root background image.");
}
const layout = readFileSync(resolve(root, "app/layout.tsx"), "utf8");
if (!layout.includes("splashCanvasActive") || !layout.includes("shf-splash-seen-v2.1.5")) {
  errors.push("Root layout must activate the sampled splash canvas and use the current session key.");
}
if (!splash.includes('root.classList.add("splashRunwayActive")')) {
  errors.push("The splash-only runway must be activated dynamically only on mobile Safari.");
}
if (!splash.includes('root.classList.remove("splashCanvasActive", "splashCanvasHandoff", "splashRunwayActive")')) {
  errors.push("Splash must remove all temporary canvas and runway states after completion.");
}
if (!/\.splashScreen\s*\{[^}]*position:\s*absolute[^}]*top:\s*0[^}]*right:\s*0[^}]*left:\s*0/s.test(splashStyles)) {
  errors.push("First-visit splash must use a document-positioned full-viewport stage so the Safari runway can expose media pixels.");
}
if (/html\.splashSessionSeen\s+\.splashScreen\s*\{[^}]*position:\s*(?:fixed|absolute)/s.test(splashStyles)) {
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

// v1.8.2 splash handoff must never expose the duplicate artwork canvas.
for (const required of [
  "splashHandoff", "splashCanvasHandoff", "--document-canvas-color",
  "afterPaint", 'body.classList.add("splashHandoff")',
]) {
  if (!(splash + splashStyles).includes(required)) errors.push(`Splash handoff hardening is missing: ${required}`);
}
if (!/\.splashHandoff \.siteShell,\s*\.splashExiting \.siteShell,[\s\S]*?\{[^}]*opacity:\s*1[^}]*transition:\s*none/s.test(splashStyles)) {
  errors.push("The destination site must be fully painted before the splash starts fading.");
}
if (!/html\.splashCanvasActive\.splashCanvasHandoff[\s\S]*--document-canvas-color:\s*var\(--color-paper\)[\s\S]*background-color:\s*var\(--document-canvas-color\)/.test(splashStyles)) {
  errors.push("The sampled splash canvas must switch atomically to the paper canvas during handoff.");
}
if (/\.splashExiting \.siteShell\s*\{[^}]*transition-delay/s.test(splashStyles)) {
  errors.push("Splash exit must not delay revealing the destination site.");
}
if (/\.splashScreen\.isExiting \.splashScreenArtWrap\s*\{[^}]*filter:\s*blur/s.test(readFileSync(resolve(root, "app/styles/splash-states.css"), "utf8"))) {
  errors.push("Splash exit must not blur the blue artwork over the destination.");
}

// v1.8.4 iOS Safari Liquid Glass hardening.
if (/body\.splashActive\s*\{[^}]*overflow:\s*hidden/s.test(splashStyles)) {
  errors.push("Splash must not lock body scrolling on iOS Safari.");
}
if (!splash.includes("shell.inert = inert") || !splash.includes('shell.setAttribute("aria-hidden", "true")')) {
  errors.push("The site shell must become inert and aria-hidden while the splash is active.");
}
if (!routeFade.includes("{transitioning && (") || !routeFade.includes('className="routeTransitionVeil"')) {
  errors.push("The fixed route curtain must be conditionally mounted only during transitions.");
}
if (/(?:^|[;{])\s*visibility:\s*hidden/m.test(transitions)) {
  errors.push("The route curtain must not remain mounted and hidden with visibility.");
}
if (!base.includes("--document-canvas-color: var(--color-paper)") || !base.includes("background-color: var(--document-canvas-color)")) {
  errors.push("html/body need an immediate server-rendered paper canvas fallback.");
}
const canvasTone = readFileSync(resolve(root, "app/components/DocumentCanvasTone.tsx"), "utf8");
for (const required of ["visualViewportHeight", "elementFromPoint", "isAtDocumentBottom", "pendingCount >= 2", "if (!candidate) return"]) {
  if (!canvasTone.includes(required)) errors.push(`DocumentCanvasTone is missing visual-viewport stability hardening: ${required}`);
}
if (canvasTone.includes("MutationObserver")) errors.push("DocumentCanvasTone must not resample from unrelated DOM mutations.");
if (/candidate\s*\?\?\s*cssToken\("--color-paper"/.test(canvasTone)) errors.push("Invalid canvas samples must retain the previous tone instead of falling back to paper.");
if (/html\.splashSessionSeen[\s\S]*background-color:\s*transparent/.test(splashStyles)) {
  errors.push("Repeat visits must never leave the root canvas transparent.");
}


if (routeFade.includes("routeTransitionActive") || routeFade.includes("routeFade--") || routeFade.includes("data-transition-kind")) {
  errors.push("Dead route-transition markers must not be restored.");
}
if (canvasTone.includes("dataset.canvasTone")) errors.push("DocumentCanvasTone must not write unused canvas-tone data attributes.");
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
for (const required of [".hero::before {", ".artistHero {", ".artistSet {", ".artistPortrait::after {"]) {
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

// v1.8.0 restores the approved v1.7.7 hero and exposes only two safe master controls.
for (const required of [
  "--gradient-size: 1", "--gradient-strength: 1",
  ".hero::before", ".paperGlowSection::before",
  "scale(var(--gradient-size))",
  "opacity: var(--gradient-strength)",
  "--glow-w: 108vw", "--glow-h: 76vw",
  "--glow-w: 84vw", "--glow-h: 94vw",
  "--glow-w: 66vw", "--glow-h: 52vw",
]) {
  if (!gradients.includes(required)) errors.push(`Simplified gradient control or approved hero geometry is missing: ${required}`);
}
for (const forbidden of [
  "--gradient-shape-x", "--gradient-shape-y", "--gradient-rotation",
  "--hero-layer-", "--gradient-layer-", "calc(var(--glow-w) *",
  "calc(var(--glow-opacity)",
]) {
  if (gradients.includes(forbidden)) errors.push(`Legacy over-centralized gradient control remains: ${forbidden}`);
}
if (!/\.hero::before\s*\{[^}]*radial-gradient\(ellipse 68% 40% at -4% 22%/s.test(gradients)) {
  errors.push("The approved v1.7.7 hero wash recipe is not restored.");
}
if (/\.hero\s*\{[^}]*transform\s*:/s.test(gradients) || /\.hero\s*\{[^}]*scale\(/s.test(gradients)) {
  errors.push("Gradient controls must never transform or scale the hero section itself.");
}
if (!/\.heroOrb,\s*\.paperGlow,\s*\.darkGlow\s*\{[^}]*width:\s*var\(--glow-w\);[^}]*height:\s*var\(--glow-h\);/s.test(gradients)) {
  errors.push("Gradient artwork must preserve the original element dimensions before visual-only scaling.");
}
if (/\.hero\s*\{[^}]*background-image/s.test(gradients)) {
  errors.push("Hero wash strength must be controlled through the isolated pseudo-element, not the section background.");
}
if (/\.artistQuote \.darkGlowOne\s*\{[^}]*--glow-(?:w|h|opacity)/s.test(artistStyles)) {
  errors.push("Artist quote dark-gradient geometry must remain centralized in gradients.css.");
}

// v2.1.6 Safari bottom-canvas and motion hardening
if (!canvasTone.includes('root.style.backgroundColor = color') || !canvasTone.includes('body.style.backgroundColor = color')) {
  errors.push("DocumentCanvasTone must apply the sampled colour directly to both html and body.");
}
if (!canvasTone.includes('documentCanvasAtFooter') || !base.includes('html.documentCanvasAtFooter')) {
  errors.push("The true document bottom must use the explicit dark Safari canvas state.");
}
if (footerStyles.includes('.siteFooter::after') || footerStyles.includes('flex: 0 0 160px')) {
  errors.push("Footer must not use flow-content bleed that makes it taller than one viewport.");
}
if (!footerStyles.includes('min-height: 100dvh') || !footerStyles.includes('.siteFooter .footerBottom { margin-top: auto; }')) {
  errors.push("Footer must retain dynamic-viewport sizing and bottom-row distribution.");
}

// v2.1.0 typed content architecture
const requiredContentFiles = [
  "app/content/models.ts",
  "app/content/validation.ts",
  "app/content/repository.ts",
  "app/content/navigation-repository.ts",
  "app/content/data/home.ts",
  "app/content/data/information-pages.ts",
  "app/content/data/contact.ts",
  "app/content/data/navigation.ts",
];
for (const file of requiredContentFiles) {
  if (!existsSync(join(root, file))) errors.push(`Missing typed content architecture file: ${file}`);
}
const appSource = joined;
if (/from\s+["'](?:\.\.\/)*lib\/content["']/.test(appSource)) errors.push("Legacy app/lib/content imports must not remain.");
if (existsSync(join(root, "app/lib/content"))) errors.push("Legacy app/lib/content directory must be removed.");
if (!appSource.includes("contentRepository.getArtists")) errors.push("Public pages must read artists through the content repository.");
if (!appSource.includes("contentRepository.getInformationPage")) errors.push("Information pages must read through the content repository.");
if (!appSource.includes("validateContent")) errors.push("Content repository must run runtime validation.");


const adminRequired = [
  "app/admin/page.tsx",
  "app/admin/login/page.tsx",
  "app/admin/lib/auth.ts",
  "app/admin/lib/content-admin.ts",
  "app/db/schema.ts",
  "app/db/migrations/0001_content_admin.sql",
  "drizzle.config.ts",
];
for (const file of adminRequired) {
  if (!existsSync(join(root, file))) errors.push(`Missing v2.1.0 admin/database file: ${file}`);
}
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (packageJson.version !== "2.1.6") errors.push("package.json version must be 2.1.6.");
// v2.1.6 artist arrow size regression guard
const responsiveCss = readFileSync(resolve(root, "app/styles/responsive.css"), "utf8");
if (/\.artistArrow\s*\{[^}]*width:\s*44px/s.test(responsiveCss) || /\.artistArrow\s*\{[^}]*margin:\s*-5px/s.test(responsiveCss)) {
  errors.push("Homepage artist arrow buttons must not reintroduce the oversized mobile override.");
}

// v2.1.6 admin authentication type safety
const adminAuth = readFileSync(resolve(root, "app/admin/lib/auth.ts"), "utf8");
if (!adminAuth.includes("const encoder = new TextEncoder()") || !adminAuth.includes("timingSafeEqual(left, right)")) {
  errors.push("Admin authentication must use TextEncoder-backed Uint8Array values for timingSafeEqual.");
}
if (adminAuth.includes("timingSafeEqual(Buffer.from")) {
  errors.push("Do not pass generic Buffer values directly to timingSafeEqual; this fails Node 22 type checking.");
}

if (!packageJson.dependencies?.["drizzle-orm"] || !packageJson.dependencies?.postgres) errors.push("Database dependencies are missing.");

// v2.1.6 motion/runtime cleanup
const motionHelpers = readFileSync(resolve(root, "app/lib/motion.ts"), "utf8");
for (const required of ["prefersReducedMotion", "cssTimeMs", "afterPaint"]) {
  if (!motionHelpers.includes(required)) errors.push(`Shared motion helper is missing: ${required}`);
}
if (routeFade.includes("document.documentElement.dataset") || routeFade.includes("transitionKindRef")) {
  errors.push("Route curtain must not mutate global root datasets or retain the obsolete transition-kind ref.");
}
if (!routeFade.includes('data-route-phase={phase}') || !transitions.includes('.routeTransitionVeil[data-route-phase=')) {
  errors.push("Route curtain phase must be scoped to the mounted route/veil elements.");
}
if (!routeFade.includes('cssTimeMs("--route-curtain') || !routeFade.includes("FALLBACK_BUFFER_MS")) {
  errors.push("Route fallback timers must derive from the CSS motion tokens.");
}
if (!canvasTone.includes("isIOSWebKit") || !canvasTone.includes("SETTLE_DELAY_MS")) {
  errors.push("DocumentCanvasTone must avoid continuous dynamic sampling on non-iOS engines and resample after toolbar settling.");
}
if (canvasTone.includes("scheduleTwice")) errors.push("Legacy double-rAF canvas scheduling must not remain.");
const appShell = readFileSync(resolve(root, "app/components/AppShell.tsx"), "utf8");
for (const obsolete of ["splashEntering", "splashHolding", "splashHandoffActive"]) {
  if (appShell.includes(obsolete)) errors.push(`Obsolete AppShell splash cleanup state remains: ${obsolete}`);
}
if (!splash.includes('cssTimeMs("--duration-splash-enter"') || !splash.includes('cssTimeMs("--duration-splash-exit"')) {
  errors.push("Splash JavaScript timing must derive from the design-system CSS tokens.");
}
if (!readFileSync(resolve(root, "app/components/SiteHeader.tsx"), "utf8").includes('cssTimeMs("--duration-menu"')) {
  errors.push("Menu fallback timing must derive from the shared CSS duration token.");
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");

