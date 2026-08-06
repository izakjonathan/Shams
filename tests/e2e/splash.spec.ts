import { expect, test } from "@playwright/test";
import { SPLASH_SESSION_KEY } from "./helpers";

test("splash appears once, hands off to the site, and records the session", async ({ page }) => {
  await page.goto("/");
  const splash = page.locator(".splashScreen");
  await expect(splash).toBeVisible();
  await expect(page.locator(".siteShell")).toHaveAttribute("aria-hidden", "true");

  await splash.waitFor({ state: "detached", timeout: 12_000 });
  await expect(page.locator(".siteShell")).not.toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => page.evaluate((key) => sessionStorage.getItem(key), SPLASH_SESSION_KEY)).toBe("1");
});

test("repeat visits skip the splash before hydration", async ({ page }) => {
  await page.addInitScript((key) => sessionStorage.setItem(key, "1"), SPLASH_SESSION_KEY);
  await page.goto("/");
  await expect(page.locator(".splashScreen")).toBeHidden();
  await expect(page.locator("main")).toBeVisible();
});
