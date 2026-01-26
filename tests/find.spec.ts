import fs from "node:fs";
import searchOptions from "../data/testData";
import { test, expect } from "@playwright/test";
import { acceptCookies, blockAds } from "../helpers/helpers";
import { performSearchBy, WallpaperPage } from "../helpers/search";

test.describe("search tests", () => {
  let wallpaperPage: WallpaperPage;

  test.beforeEach(async ({ page, context }) => {
    await blockAds(context);
    await page.goto("/");
    await acceptCookies(page);
    wallpaperPage = new WallpaperPage(page);
  });

  test("should search for amazing wallpapers", async ({ page }) => {
    await performSearchBy(page, "amazing", searchOptions[1]);
    await expect(page).toHaveURL(/wallpapers\?keyword=amazing/);
    await expect(page.getByRole("heading", { name: "amazing Wallpapers" })).toBeVisible();
    await expect(page.getByRole("button", { name: searchOptions[1] })).toBeVisible();
  });

  test("should identify free and premium wallpapers", async ({ page }) => {
    await performSearchBy(page, "nature");
    await page.waitForURL(/nature/);

    await wallpaperPage.openFree();
    await page.waitForURL(/wallpapers/);

    await expect(page.locator("span", { hasText: "Premium" })).toHaveCount(0);
    await page.goBack({ waitUntil: "domcontentloaded" });

    await wallpaperPage.openPremium(1);
    await page.waitForURL(/wallpapers/);
    await expect(page.locator("span", { hasText: "Premium" })).toBeVisible();
  });

  test("should download free wallpaper", async ({ page }) => {
    await performSearchBy(page, "nature");
    await page.waitForURL(/nature/);

    await wallpaperPage.openFree(1);
    await page.waitForURL(/wallpapers/);

    const downloadedFilePath = await wallpaperPage.downloadButtonClick();
    await expect(fs.existsSync(downloadedFilePath)).toBeTruthy();
  });

  test.afterEach(async ({ page, context }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
      });
    }
    //TODO check how Playwright closes after
    await page.close();
    await context.clearCookies();
  });
});
