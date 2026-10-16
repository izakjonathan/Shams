import { expect, test } from "@playwright/test";
import { skipSplash, waitForRouteIdle } from "./helpers";

test("mobile reveals are one-shot, keyboard-safe and obey live Reduce Motion", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  const row = page.locator(".artistRow").first();
  await expect(row).toHaveClass(/isLowerRevealPending/);
  // Focus a below-screen control without scrolling first: it must become readable.
  await row.locator("a.artistArrow").focus();
  await expect(row).toHaveClass(/isLowerRevealVisible/);
  await expect(row).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".isLowerRevealPending")).toHaveCount(0);
  await expect(page.locator('.ticketGrid article:not([data-availability="sold-out"])').first()).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(row).toHaveClass(/isLowerRevealVisible/);
});

test("gallery bounds its image layers and supports pause and live motion preferences", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  const gallery = page.locator("#gallery");
  expect(await gallery.locator("img").count()).toBeLessThanOrEqual(3);
  await gallery.scrollIntoViewIfNeeded();
  const pause = page.getByRole("button", { name: "Pause gallery", exact: true });
  await pause.click();
  await expect(page.getByRole("button", { name: "Resume gallery" })).toHaveAttribute("aria-pressed", "true");
  const active = await gallery.locator(".isActive img").getAttribute("src");
  await page.waitForTimeout(5100);
  await expect(gallery.locator(".isActive img")).toHaveAttribute("src", active!);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Gallery paused" })).toBeDisabled();
  await expect.poll(() => gallery.locator(".isActive").evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration),
  )).toBeLessThan(.001);
});

test("normal gallery advances only to a loaded photograph", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  const first = await page.locator(".eventGallerySlide.isActive img").getAttribute("src");
  await expect.poll(() => page.locator(".eventGallerySlide.isActive img").getAttribute("src"), { timeout: 12_000 }).not.toBe(first);
  expect(await page.locator(".eventGallerySlide").count()).toBeLessThanOrEqual(3);
  expect(await page.locator(".eventGallerySlide.isActive img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test("reduced motion skips the first splash and keeps menus, filters and FAQ usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".splashScreen")).toBeHidden();
  await expect(page.locator(".siteShell")).toHaveJSProperty("inert", false);
  await expect(page.locator(".heroTitleLine > span").first()).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  const filter = page.getByRole("button", { name: "Music", exact: true });
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  const question = page.locator(".faqList article").nth(1).getByRole("button");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: /View .* artist page/ }).first().click();
  await waitForRouteIdle(page);
  await expect(page.locator(".artistPage h1")).toBeVisible();
});

test("all content remains readable without IntersectionObserver", async ({ page }) => {
  await skipSplash(page);
  await page.addInitScript(() => { delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver; });
  await page.goto("/");
  await expect(page.locator(".isLowerRevealPending")).toHaveCount(0);
  await expect(page.locator('.ticketGrid article:not([data-availability="sold-out"])').first()).toHaveCSS("opacity", "1");
});

test("splash is bounded when unrelated page images are delayed", async ({ page }) => {
  await page.route("**/images/gallery/**", async (route) => { await new Promise((resolve) => setTimeout(resolve, 6000)); await route.continue().catch(() => {}); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".splashScreen")).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator(".siteShell")).toHaveJSProperty("inert", false);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#000000");
  await expect(page.locator("html")).toHaveCSS("background-color", "rgb(0, 0, 0)");
});

test("small screens have no horizontal overflow after motion and menu interactions", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await skipSplash(page);
  await page.goto("/");
  await page.locator(".ticketGrid").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("server content stays readable with JavaScript disabled", async ({ browser, baseURL, ignoreHTTPSErrors }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, ignoreHTTPSErrors, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".splashScreen")).toBeHidden();
  await expect(page.locator(".siteShell")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero h1")).toBeVisible();
  await expect(page.locator(".artistRow").first()).toHaveCSS("opacity", "1");
  await context.close();
});
