import { expect, test } from "@playwright/test";
import { skipSplash, waitForRouteIdle } from "./helpers";

test("mobile reveals are one-shot, keyboard-safe and obey live Reduce Motion", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  const row = page.locator(".artistRow").first();
  await expect(row).toHaveClass(/isLowerRevealPending/);
  // Focus a below-screen control without scrolling first: it must become readable.
  await row.locator("a.artistRowLink").focus();
  await expect(row).toHaveClass(/isLowerRevealVisible/);
  await expect(row).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".isLowerRevealPending")).toHaveCount(0);
  await expect(page.locator('.ticketGrid article:not([data-availability="sold-out"])').first()).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(row).toHaveClass(/isLowerRevealVisible/);
});

test("gallery advances decoded frames, supports manual navigation, and pauses", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  const counter = gallery.locator(".galleryCount");
  const initial = await counter.textContent();
  await expect.poll(() => counter.textContent(), { timeout: 14_000 }).not.toBe(initial);
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
  await gallery.getByRole("button", { name: "Pause gallery slideshow" }).click();
  const paused = await counter.textContent();
  await page.waitForTimeout(5300);
  await expect(counter).toHaveText(paused!);
  await gallery.getByRole("button", { name: "Next gallery image" }).click();
  await expect.poll(() => counter.textContent()).not.toBe(paused);
  await gallery.getByRole("button", { name: "Resume gallery slideshow" }).click();
  expect(await gallery.locator(".eventGallerySlide").count()).toBeLessThanOrEqual(2);
});

test("gallery does not advance when scrolled away or when the document is hidden", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => gallery.evaluate((node) => node.getBoundingClientRect().top >= window.innerHeight)).toBe(true);
  const before = await gallery.locator(".galleryCount").textContent();
  await page.waitForTimeout(5500);
  await expect(gallery.locator(".galleryCount")).toHaveText(before!);
});

test("reduced motion starts paused and reacts to live preference changes", async ({ page }) => {
  await skipSplash(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.getByRole("button", { name: "Resume gallery slideshow" })).toBeVisible();
  const before = await gallery.locator(".galleryCount").textContent();
  await page.waitForTimeout(5200);
  await expect(gallery.locator(".galleryCount")).toHaveText(before!);
  await gallery.getByRole("button", { name: "Next gallery image" }).click();
  await expect.poll(() => gallery.locator(".galleryCount").textContent()).not.toBe(before);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(gallery.getByRole("button", { name: "Pause gallery slideshow" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(gallery.getByRole("button", { name: "Resume gallery slideshow" })).toBeVisible();
});

test("a failed gallery image is skipped without a blank active slide", async ({ page }) => {
  await skipSplash(page);
  // The second bundled gallery frame is gallery-06.webp; intercept the actual
  // responsive optimizer request, not the old unoptimized image path.
  await page.route("**/_next/image?**", async (route) => {
    if (route.request().url().includes("gallery-06.webp")) await route.abort();
    else await route.continue();
  });
  await page.goto("/");
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
  await expect.poll(() => gallery.locator(".galleryCount").textContent(), { timeout: 16_000 }).not.toBe("01 / 14");
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
});

test("slow gallery media never makes the current image disappear", async ({ page }) => {
  await skipSplash(page);
  await page.route("**/_next/image?**", async (route) => {
    if (route.request().url().includes("gallery-06.webp")) {
      await new Promise((resolve) => setTimeout(resolve, 9000));
    }
    await route.continue().catch(() => {});
  });
  await page.goto("/");
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
  await page.waitForTimeout(5400);
  await expect(gallery.locator(".eventGallerySlide.isActive img")).toBeVisible();
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

test("search-only navigation bypasses the curtain and browser Back restores reading position", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/?motion-query=1");
  await page.locator("#lineup").scrollIntoViewIfNeeded();
  const readingY = await page.evaluate(() => window.scrollY);
  await page.locator('.siteHeader a[href="/#top"]').first().click();
  await expect(page).toHaveURL(/\/#top$/);
  await expect(page.locator(".routeTransitionVeil")).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/motion-query=1/);
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 }).toBeGreaterThan(Math.max(0, readingY - 200));
});
