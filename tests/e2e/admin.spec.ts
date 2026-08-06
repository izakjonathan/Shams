import { expect, test } from "@playwright/test";

test("admin login route renders without entering the public shell", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: /admin/i })).toBeVisible();
  await expect(page.locator(".splashScreen")).toHaveCount(0);
  await expect(page.locator(".siteHeader")).toHaveCount(0);
});

test("unauthenticated admin workspace redirects to login", async ({ page }) => {
  await page.goto("/admin/artists");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("protected preview and audit routes require authentication", async ({ page }) => {
  await page.goto("/admin/audit");
  await expect(page).toHaveURL(/\/admin\/login/);

  await page.goto("/admin/preview/artist/artist-01");
  await expect(page).toHaveURL(/\/admin\/login/);
});
