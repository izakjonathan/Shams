import { expect, test } from "@playwright/test";
import { skipSplash } from "./helpers";

test.beforeEach(async ({ page }) => {
  await skipSplash(page);
});

test("reduced motion keeps navigation functional", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: /View .* artist page/ }).first().click();
  await expect(page.locator(".artistPage h1")).toBeVisible();
});

test("external artist links announce a new tab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /View .* artist page/ }).first().click();
  const external = page.locator('a[target="_blank"]').first();
  if (await external.count()) {
    await expect(external).toHaveAttribute("rel", /noopener/);
    await expect(external).toContainText(/opens in a new tab/i);
  }
});

test("contact email addresses are real mail links", async ({ page }) => {
  await page.goto("/contact");
  const mailLinks = page.locator('a[href^="mailto:"]');
  await expect(mailLinks.first()).toBeVisible();
});
