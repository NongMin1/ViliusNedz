import fs from "node:fs";
import { SEARCH_CATEGORIES } from "../data/testData";
import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/searchPage";
import { WallpaperPage } from "../pages/wallpaperPage";
import { acceptCookies, blockAds } from "../helpers/helpers";

test.describe("search tests", () => {
  let wallpaperPage: WallpaperPage;
  let searchPage: SearchPage;

  test.beforeEach(async ({ page, context }) => {
    await blockAds(context);
    await page.goto("/");
    await acceptCookies(page);
    wallpaperPage = new WallpaperPage(page);
    searchPage = new SearchPage(page);
  });

  test("should search for amazing wallpapers", async ({ page }) => {
    await searchPage.search({ query: "amazing", category: SEARCH_CATEGORIES.WALLPAPERS });
    await expect(page).toHaveURL(/wallpapers\?keyword=amazing/);
    await expect(page.getByRole("heading", { name: "amazing Wallpapers" })).toBeVisible();
    await expect(page.getByRole("button", { name: SEARCH_CATEGORIES.WALLPAPERS })).toBeVisible();
  });

  test("should identify free and premium wallpapers", async ({ page }) => {
    await searchPage.search({ query: "nature" });
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
    await searchPage.search({ query: "nature" });
    await page.waitForURL(/nature/);

    await wallpaperPage.openFree(1);
    await page.waitForURL(/wallpapers/);

    const downloadedFilePath = await wallpaperPage.download();
    await expect(fs.existsSync(downloadedFilePath)).toBeTruthy();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
      });
    }
  });
});
