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
const splash = readFileSync(resolve(root, "app/components/SplashScreen.tsx"), "utf8");
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

const splashStyles = readFileSync(resolve(root, "app/styles/splash.css"), "utf8");
if (!splash.includes("splash-humanity-artwork.png")) errors.push("Splash must use the supplied humanity artwork.");
if (!splashStyles.includes("background-color: transparent") || !splashStyles.includes("min-height: 100svh") || !splashStyles.includes("height: 100dvh")) {
  errors.push("Splash overlay must cover the full safe viewport while its wrapper remains visually transparent.");
}
for (const required of [
  "--safari-splash-color", "--safari-splash-top-bleed", "--safari-splash-bottom-bleed",
  "top: calc(-1 * var(--safari-splash-top-bleed))",
  "bottom: calc(-1 * var(--safari-splash-bottom-bleed))",
]) {
  if (!splashStyles.includes(required)) errors.push(`Safari splash viewport hardening is missing: ${required}`);
}
if (/html\.splashCanvasActive[\s\S]*background-image:\s*url\(/.test(splashStyles)) {
  errors.push("Safari splash tinting must use an explicit sampled root colour, not a root background image.");
}
const layout = readFileSync(resolve(root, "app/layout.tsx"), "utf8");
if (!layout.includes("splashCanvasActive") || !layout.includes("shf-splash-seen-v2.5.0")) {
  errors.push("Root layout must activate the sampled splash canvas and use the current session key.");
}
if (!splash.includes('root.classList.remove("splashCanvasActive", "splashCanvasHandoff")')) {
  errors.push("Splash must remove all temporary canvas states after completion.");
}
if (!/\.splashScreen\s*\{[^}]*position:\s*fixed[^}]*top:\s*0[^}]*right:\s*0[^}]*left:\s*0/s.test(splashStyles)) {
  errors.push("Splash must use a fixed full-viewport stage without mutating document scroll.");
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
  "--gradient-size: 1.5", "--gradient-strength: 1.2",
  ".hero::before", ".paperGlowSection::before",
  "calc(var(--glow-opacity, 1) + (var(--gradient-strength) - 1))",
  "--glow-w: 162vw", "--glow-h: 114vw",
  "--glow-w: 126vw", "--glow-h: 141vw",
  "--glow-w: 99vw", "--glow-h: 78vw",
]) {
  if (!gradients.includes(required)) errors.push(`Simplified gradient control or approved hero geometry is missing: ${required}`);
}

if (gradients.includes("scale(var(--gradient-size))") || gradients.includes("blur(var(--hero-glow-blur")) {
  errors.push("Stable restoration must not use runtime gradient scaling or hero blur.");
}
if (!gradients.includes("--gradient-size: 1.5")) errors.push("Stable restored gradient size must be 1.5.");
if (!gradients.includes("inset: -25%")) errors.push("Stable gradient washes must use direct overscan geometry.");
if (gradients.includes("scale(var(--gradient-size))")) errors.push("Runtime gradient scale transforms must remain removed.");
if (gradients.includes("blur(var(--hero-glow-blur")) errors.push("Hero gradient blur must remain disabled.");
if (!readFileSync(resolve(root, "app/styles/splash-states.css"), "utf8").includes("only the final overlay dissolves")) {
  errors.push("Stable splash must use one overlay-opacity dissolve.");
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
  errors.push("Gradient artwork must use direct element dimensions.");
}
if (/\.hero\s*\{[^}]*background-image/s.test(gradients)) {
  errors.push("Hero wash strength must be controlled through the isolated pseudo-element, not the section background.");
}
if (/\.artistQuote \.darkGlowOne\s*\{[^}]*--glow-(?:w|h|opacity)/s.test(artistStyles)) {
  errors.push("Artist quote dark-gradient geometry must remain centralized in gradients.css.");
}

// v2.1.8 Safari bottom-canvas and motion hardening
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
if (packageJson.version !== "2.5.0") errors.push("package.json version must be 2.5.0.");
// v2.1.8 footer canvas permanence guards
const canvasToneV217 = readFileSync(resolve(root, "app/components/DocumentCanvasTone.tsx"), "utf8");
const baseCssV217 = readFileSync(resolve(root, "app/styles/base.css"), "utf8");
if (!canvasToneV217.includes("footerTouchesVisualViewportBottom")) errors.push("Document canvas must detect footer contact with the visual viewport bottom.");
if (!canvasToneV217.includes("footerTouchesVisualViewportBottom() || isAtDocumentBottom()")) errors.push("Footer canvas lock must not depend only on exact document-end metrics.");
if (!baseCssV217.includes("html.documentCanvasAtFooter body::after")) errors.push("Footer canvas state must provide a non-layout black Safari underlay.");
if (!baseCssV217.includes("body::after") || !baseCssV217.includes("display: none")) errors.push("The Safari footer underlay must be display:none outside footer state.");
if (readFileSync(resolve(root, "app/styles/footer.css"), "utf8").includes("footerCanvasBleed")) errors.push("Footer must not regain flow-based canvas bleed that increases its height.");

// v2.1.8 artist arrow size regression guard
const responsiveCss = readFileSync(resolve(root, "app/styles/responsive.css"), "utf8");
if (/\.artistArrow\s*\{[^}]*width:\s*44px/s.test(responsiveCss) || /\.artistArrow\s*\{[^}]*margin:\s*-5px/s.test(responsiveCss)) {
  errors.push("Homepage artist arrow buttons must not reintroduce the oversized mobile override.");
}

// v2.1.8 admin authentication type safety
const adminAuth = readFileSync(resolve(root, "app/admin/lib/auth.ts"), "utf8");
if (!adminAuth.includes("const encoder = new TextEncoder()") || !adminAuth.includes("timingSafeEqual(left, right)")) {
  errors.push("Admin authentication must use TextEncoder-backed Uint8Array values for timingSafeEqual.");
}
if (adminAuth.includes("timingSafeEqual(Buffer.from")) {
  errors.push("Do not pass generic Buffer values directly to timingSafeEqual; this fails Node 22 type checking.");
}

if (!packageJson.dependencies?.["drizzle-orm"] || !packageJson.dependencies?.postgres) errors.push("Database dependencies are missing.");

// v2.1.8 motion/runtime cleanup
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


// v2.1.9 Constitution alignment phase-one guards.
const adminActions = readFileSync(resolve(root, "app/admin/actions/content.ts"), "utf8");
const adminValidation = readFileSync(resolve(root, "app/content/admin-validation.ts"), "utf8");
const contentAdmin = readFileSync(resolve(root, "app/admin/lib/content-admin.ts"), "utf8");
if (!adminActions.includes("validateAdminRecord") || !adminActions.includes("parseContentStatus")) {
  errors.push("Admin writes must pass through canonical type-specific validation before persistence.");
}
for (const required of ["validateArtist", "validateProgramme", "validateTicket", "validateFaq", "validatePage", "VALID_STATUSES"]) {
  if (!adminValidation.includes(required)) errors.push(`Admin content validation is missing: ${required}`);
}
if (!contentAdmin.includes("packageJson.version") || contentAdmin.includes('version: "2.1.5"')) {
  errors.push("Database seed audit metadata must derive from the current package version.");
}
if (!routeFade.includes("function focusElement") || !routeFade.includes("focusElement(target ??")) {
  errors.push("Same-route and cross-route focus restoration must use the shared focus helper.");
}
if (existsSync(resolve(root, "public/images/splash-humanity-artwork.jpeg"))) {
  errors.push("The unused legacy splash JPEG must not remain in the release package.");
}
if (!gradients.includes("calc(var(--glow-opacity, 1) + (var(--gradient-strength) - 1))")) {
  errors.push("Gradient strength above 1 must use bounded opacity amplification without full-layer colour filters.");
}
if (!packageJson.engines || packageJson.engines.node !== "22.x") {
  errors.push("The release must pin the intended Node major for Vercel builds.");
}
if (!existsSync(resolve(root, "CHANGELOG.md")) || !existsSync(resolve(root, "QA_MATRIX.md"))) {
  errors.push("Constitution alignment releases require a changelog and documented QA matrix.");
}


// v2.2.0 verification and regression foundation guards.
const playwrightConfig = readFileSync(resolve(root, "playwright.config.ts"), "utf8");
const packageScripts = packageJson.scripts ?? {};
for (const required of ["test:e2e", "test:visual", "test:visual:update", "verify"]) {
  if (!packageScripts[required]) errors.push(`Verification script is missing: ${required}`);
}
if (packageJson.devDependencies?.["@playwright/test"] !== "1.62.0") {
  errors.push("Playwright must be pinned for the v2.2.0 verification baseline.");
}
for (const required of ["chromium", "webkit-mobile", "visual-chromium", 'trace: "on-first-retry"', "webServer"]) {
  if (!playwrightConfig.includes(required)) errors.push(`Playwright configuration is missing: ${required}`);
}
for (const file of [
  "tests/e2e/splash.spec.ts",
  "tests/e2e/public-navigation.spec.ts",
  "tests/e2e/accessibility-motion.spec.ts",
  "tests/e2e/admin.spec.ts",
  "tests/visual/approved-surfaces.spec.ts",
  "scripts/verify-release.mjs",
  ".github/workflows/quality.yml",
  "DEPLOYMENT_RUNBOOK.md",
]) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing verification foundation file: ${file}`);
}
const publicNavigationTests = readFileSync(resolve(root, "tests/e2e/public-navigation.spec.ts"), "utf8");
for (const required of ["mobile menu", "artist page", "information page", "programme filters"]) {
  if (!publicNavigationTests.includes(required)) errors.push(`Public navigation smoke coverage is missing: ${required}`);
}
const splashTests = readFileSync(resolve(root, "tests/e2e/splash.spec.ts"), "utf8");
if (!splashTests.includes("repeat visits skip the splash") || !splashTests.includes("records the session")) {
  errors.push("Splash smoke coverage must include first-visit handoff and repeat-visit suppression.");
}
const qualityWorkflow = readFileSync(resolve(root, ".github/workflows/quality.yml"), "utf8");
if (!qualityWorkflow.includes("package-lock.json is required") || !qualityWorkflow.includes("npm ci") || !qualityWorkflow.includes("playwright install")) {
  errors.push("CI must enforce a lockfile, use npm ci, and install Playwright browsers.");
}


// v2.3.0 admin publishing and governance guards.
const adminContent = readFileSync(resolve(root, "app/admin/lib/content-admin.ts"), "utf8");
const adminPublishingActions = readFileSync(resolve(root, "app/admin/actions/content.ts"), "utf8");
const adminEditor = readFileSync(resolve(root, "app/admin/components/RecordEditor.tsx"), "utf8");
const adminRoutes = readFileSync(resolve(root, "app/admin/lib/routes.ts"), "utf8");
for (const required of ["expectedUpdatedAt", "Slug \"", "listAuditEntries", "status:"]) {
  if (!adminContent.includes(required)) errors.push(`Admin publishing safety is missing: ${required}`);
}
for (const required of ["intent === \"publish\"", "adminRouteForType", "expectedUpdatedAt"]) {
  if (!adminPublishingActions.includes(required)) errors.push(`Admin publishing action is missing: ${required}`);
}
for (const required of ["Preview record", "Publish", "Move to draft", "Archive"]) {
  if (!adminEditor.includes(required)) errors.push(`Admin editor workflow is missing: ${required}`);
}
if (!adminRoutes.includes('if (type === "faq") return "faqs"') || !adminRoutes.includes('if (type === "page") return "pages"')) {
  errors.push("Admin content routes must use canonical plural route names.");
}
for (const path of ["app/admin/audit/page.tsx", "app/admin/preview/[type]/[id]/page.tsx"]) {
  if (!existsSync(resolve(root, path))) errors.push(`Missing v2.3.0 admin workflow file: ${path}`);
}


// v2.4.0 database-backed public content and preview guards.
const publicRepository = readFileSync(resolve(root, "app/content/public-repository.ts"), "utf8");
const previewRoute = readFileSync(resolve(root, "app/api/preview/route.ts"), "utf8");
const previewExit = readFileSync(resolve(root, "app/api/preview/exit/route.ts"), "utf8");
const previewBanner = readFileSync(resolve(root, "app/components/PreviewBanner.tsx"), "utf8");
const databasePublicRecords = readFileSync(resolve(root, "app/content/database-public-records.ts"), "utf8");
for (const required of ["CONTENT_SOURCE", "CONTENT_DATABASE_FAILURE", "draftMode", "local-fallback"]) {
  if (!publicRepository.includes(required)) errors.push(`Public database repository coordinator is missing: ${required}`);
}
for (const required of ["unstable_cache", "CONTENT_TAGS"]) {
  if (!databasePublicRecords.includes(required)) errors.push(`Database public-record adapter is missing: ${required}`);
}
if (!previewRoute.includes("getAdminIdentity") || !previewRoute.includes(".enable()")) errors.push("Draft preview enable route must require an admin session and enable Draft Mode.");
if (!previewExit.includes(".disable()")) errors.push("Draft preview exit route must disable Draft Mode.");
if (!previewBanner.includes("noindex,nofollow") || !previewBanner.includes("Exit preview")) errors.push("Draft preview must be visibly identified and excluded from indexing.");
if (!adminActions.includes("revalidateTag") || !adminActions.includes("CONTENT_TAGS")) errors.push("Publishing actions must invalidate the affected public content tag.");


// v2.4.4 production runtime and server/client boundary guards.
const contentIndex = readFileSync(resolve(root, "app/content/index.ts"), "utf8");
const contentServerEntry = readFileSync(resolve(root, "app/content/server.ts"), "utf8");
const siteHeaderSource = readFileSync(resolve(root, "app/components/SiteHeader.tsx"), "utf8");
if (contentIndex.includes("public-repository") || contentIndex.includes("publicContentRepository")) {
  errors.push("Client-safe content index must not re-export the server-only public repository.");
}
if (!contentServerEntry.includes('import "server-only"') || !contentServerEntry.includes("publicContentRepository")) {
  errors.push("Server public content must be exported through the explicit server-only content entry.");
}
if (siteHeaderSource.includes("content/server") || siteHeaderSource.includes("public-repository")) {
  errors.push("Client header must not import the server-only content repository.");
}
if (!appSource.includes('from "./content/server"') && !appSource.includes('from "../content/server"') && !appSource.includes('from "../../content/server"')) {
  errors.push("Public server pages must import database-backed content from the explicit server entry.");
}



// v2.5.0 stable restoration: startup must not mutate document scroll.
if (layout.includes("initial-scroll-and-splash-gate") || layout.includes("initialScrollGuardActive") || layout.includes("scrollTo(0,0)") || layout.includes("__shamsReleaseInitialScrollGuard")) {
  errors.push("Diagnostic release must not contain the startup scroll guard or initial-load scroll mutation.");
}
if (!layout.includes('id="splash-session-gate"') || !layout.includes("shf-splash-seen-v2.5.0")) {
  errors.push("Diagnostic release must retain only the session splash gate.");
}
if (splash.includes("releaseInitialScrollGuard")) errors.push("Splash must not depend on startup scroll-guard cleanup.");

// v2.4.8 runtime hardening and lazy database adapter.
const publicRepository242 = readFileSync(resolve(root, "app/content/public-repository.ts"), "utf8");
const databaseRecords242 = readFileSync(resolve(root, "app/content/database-public-records.ts"), "utf8");
const nextConfig242 = readFileSync(resolve(root, "next.config.ts"), "utf8");
const package242 = readFileSync(resolve(root, "package.json"), "utf8");
if (!publicRepository242.includes('await import(\n      "./database-public-records"')) errors.push("Database public records must be loaded lazily only in database mode.");
if (publicRepository242.includes('from "../db/client"') || publicRepository242.includes('from "drizzle-orm"')) errors.push("The public repository coordinator must not import PostgreSQL or Drizzle directly.");
if (!databaseRecords242.includes('import "server-only"') || !databaseRecords242.includes('from "../db/client"')) errors.push("The database public-record adapter must remain an explicit server-only module.");
if (!nextConfig242.includes('serverExternalPackages: ["postgres"]')) errors.push("The postgres driver must be externalized from Next.js server bundles.");
if (!package242.includes('"audit:boundaries"') || !package242.includes('npm run audit:boundaries')) errors.push("Runtime-boundary checks must be part of release scripts and prebuild.");
for (const path of ["app/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "app/accessibility/page.tsx", "app/contact/page.tsx", "app/artists/[slug]/page.tsx", "app/admin/layout.tsx", "app/api/preview/route.ts", "app/api/preview/exit/route.ts"]) {
  if (!readFileSync(resolve(root, path), "utf8").includes('export const runtime = "nodejs";')) errors.push(`${path} must declare the Node.js runtime.`);
}

// v2.4.8 initial-load determinism guards.
if (!splash.includes("document.fonts.ready") || !splash.includes("FONT_READY_TIMEOUT_MS")) {
  errors.push("Splash must wait boundedly for the display font before revealing the hero.");
}
if (existsSync(resolve(root, "app/components/ScrollReveal.tsx"))) {
  errors.push("Progressive ScrollReveal must remain removed from the public runtime.");
}
const publicHome245 = readFileSync(resolve(root, "app/page.tsx"), "utf8");
if (publicHome245.includes("ScrollReveal")) {
  errors.push("Homepage must render in its final visible state without hydration concealment.");
}
if ((splash + splashStyles + layout).includes("splashRunwayActive") || (splash + splashStyles).includes("safari-splash-scroll-offset") || splash.includes("scrollTo({ top: offset")) {
  errors.push("Splash must not mutate document scroll through a runway.");
}
if (/saturate\(var\(--gradient-strength\)\)|contrast\(var\(--gradient-strength\)\)/.test(gradients)) {
  errors.push("Large gradient layers must not use saturation/contrast filters; they cause avoidable Safari repaints.");
}

// v2.4.8 managed section navigation must not leave stale URL fragments that Safari restores on reload.
if (routeFade.includes('window.history.pushState(window.history.state, "", hash)')) {
  errors.push("Managed same-page navigation must not persist section hashes in browser history.");
}
if (!routeFade.includes("clearManagedHash()") || !routeFade.includes("if (pending?.hash) clearManagedHash()")) {
  errors.push("Managed same-page and cross-route hash destinations must clean their temporary URL fragment after positioning.");
}
if (/href="#(?:about|mission|tickets)"/.test(readFileSync(resolve(root, "app/page.tsx"), "utf8"))) {
  errors.push("Homepage section controls must use managed FadeLink navigation instead of persistent raw hash anchors.");
}
// v2.5.0 deliberately does not mutate startup URL or scroll state.

// v2.4.8 deterministic managed-target navigation remains for in-app navigation.
if (!routeFade.includes('href: `${destination.pathname}${destination.search}`')) {
  errors.push("Cross-route navigation must not pass managed fragments into router.push/replace.");
}
if (routeFade.includes('href: `${destination.pathname}${destination.search}${destination.hash}`')) {
  errors.push("Native hash navigation must not compete with RouteFade destination positioning.");
}
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}
console.log("Static architecture audit passed.");

