import type { Page } from "@playwright/test";

export const SPLASH_SESSION_KEY = "shf-splash-seen-v2.1.8";

export async function skipSplash(page: Page): Promise<void> {
  await page.addInitScript((key) => {
    window.sessionStorage.setItem(key, "1");
  }, SPLASH_SESSION_KEY);
}

export async function waitForRouteIdle(page: Page): Promise<void> {
  await page.locator(".routeTransitionVeil").waitFor({ state: "detached", timeout: 10_000 }).catch(() => {});
  await page.locator("main").first().waitFor({ state: "visible" });
}
