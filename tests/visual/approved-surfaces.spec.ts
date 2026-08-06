import { expect, test } from "@playwright/test";
import { SPLASH_SESSION_KEY } from "../e2e/helpers";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), SPLASH_SESSION_KEY);
});

test("@visual approved public surfaces", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage-hero.png", { fullPage: false });

  await page.goto("/");
  await page.getByText("04 — PROGRAMME", { exact: true }).scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("programme.png", { fullPage: false });

  await page.getByRole("link", { name: /View .* artist page/ }).first().click();
  await expect(page.locator(".artistPage h1")).toBeVisible();
  await expect(page).toHaveScreenshot("artist-page.png", { fullPage: false });

  await page.goto("/privacy");
  await expect(page).toHaveScreenshot("privacy-page.png", { fullPage: false });

  await page.goto("/#site-footer");
  await expect(page).toHaveScreenshot("footer-bottom.png", { fullPage: false });
});
