import { expect, test } from "@playwright/test";
import { skipSplash, waitForRouteIdle } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipSplash(page);
});

test("mobile menu opens, closes, and returns interaction to the page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "webkit-mobile", "Mobile-menu lifecycle is covered in the mobile project.");
  await page.goto("/");
  const openButton = page.getByRole("button", { name: "Open navigation menu" });
  await openButton.click();

  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeVisible();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);

  await page.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeDetached();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
});

test("artist page opens through the curtain and closes back to its lineup row", async ({ page }) => {
  await page.goto("/#lineup");
  const artistLink = page.getByRole("link", { name: /View .* artist page/ }).first();
  const targetHref = await artistLink.getAttribute("href");
  expect(targetHref).toMatch(/^\/artists\//);

  await artistLink.click();
  await waitForRouteIdle(page);
  await expect(page).toHaveURL(new RegExp(`${targetHref}$`));
  await expect(page.locator(".artistPage h1")).toBeVisible();

  await page.getByRole("link", { name: "Close the artist page and return to the lineup" }).click();
  await waitForRouteIdle(page);
  await expect(page).toHaveURL(/\/#artist-/);
  await expect(page.locator(".artistRow:target")).toBeVisible();
});

test("information page close returns to the footer", async ({ page }) => {
  await page.goto("/privacy");
  await page.getByRole("link", { name: /Close this page and return to the bottom/ }).click();
  await waitForRouteIdle(page);
  await expect(page).toHaveURL(/\/#site-footer$/);
  await expect(page.locator("#site-footer")).toBeVisible();

  const footerContact = await page.evaluate(() => {
    const footer = document.querySelector("#site-footer");
    if (!footer) return false;
    const rect = footer.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    return rect.bottom >= viewportHeight - 4 && rect.top < viewportHeight;
  });
  expect(footerContact).toBe(true);
});

test("programme filters remain usable and publish their state accessibly", async ({ page }) => {
  await page.goto("/#programme");
  const filters = page.getByRole("group", { name: "Filter programme" });
  await expect(filters).toBeVisible();

  const music = page.getByRole("button", { name: "Music" });
  await music.click();
  await expect(music).toHaveAttribute("aria-pressed", "true");
  const entries = page.locator(".programmeEntry");
  expect(await entries.count()).toBeGreaterThan(0);
  await expect(entries.locator(".programmeEntryMeta span:last-child").first()).toHaveText(/music/i);
});
