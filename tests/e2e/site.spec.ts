import { expect, test } from "@playwright/test";

const sessionKey = "shf-splash-seen";

test("splash appears once per tab session", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".splashScreen")).toBeVisible();
  await expect(page.locator(".splashScreen")).toBeHidden({ timeout: 6_000 });

  await page.reload();
  await expect(page.locator(".splashScreen")).toHaveCount(0);
  await expect(page.locator("main")).toBeVisible();
});

test("mobile navigation is modal, scrollable and restores focus", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), sessionKey);
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Open navigation menu" });
  await menuButton.focus();
  await menuButton.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(page.locator(".siteFooter")).toHaveAttribute("inert", "");
  await expect(dialog).toHaveCSS("overflow-y", "auto");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden({ timeout: 1_500 });
  await expect(menuButton).toBeFocused();
});

test("homepage artist navigation returns without replaying splash", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), sessionKey);
  await page.goto("/");

  await page.getByRole("link", { name: /View Nour artist page/i }).click();
  await expect(page).toHaveURL(/\/artists\/nour$/);
  await expect(page.getByRole("heading", { name: "Nour", level: 1 })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".splashScreen")).toHaveCount(0);
});
