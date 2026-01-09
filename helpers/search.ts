import path from "node:path";
import { Page, Locator } from "@playwright/test";

export class WallpaperPage {
  constructor(private readonly page: Page) {}

  private cards(): Locator {
    return this.page.locator('[class^="CardsContainer"] a[href^="/wallpapers/"]');
  }

  freeItems(): Locator {
    return this.cards().filter({
      hasNot: this.page.locator('[style*="premium"]'),
    });
  }

  premiumItems(): Locator {
    return this.cards().filter({
      has: this.page.locator('[style*="premium"]'),
    });
  }

  async openFree(index = 0) {
    await this.freeItems().nth(index).click();
  }

  async openPremium(index = 0) {
    await this.premiumItems().nth(index).click();
  }

  async downloadButtonClick() {
    const downloadPromise = this.page.waitForEvent("download");

    await this.page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    const popUp = this.page.locator('div[class^="Modal_modal"]');
    await popUp.waitFor({ state: "detached", timeout: 20000 }).catch(() => {});

    const downloadsFolder = path.resolve(process.cwd(), "test-results", "downloads");
    const filePath = path.join(downloadsFolder, download.suggestedFilename());

    await download.saveAs(filePath);

    return filePath;
  }
}

export async function performSearchBy(page: Page, query: string, option?: string) {
  await page.getByRole("link", { name: "Browse Now" }).click();

  if (option) {
    const dropdown = page.locator("button", { hasText: "All" }).first();
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();

    const optionLocator = page.getByRole("menuitemradio", { name: option }).first();
    await optionLocator.waitFor({ state: "visible" });
    await optionLocator.click();
  }

  await page
    .getByPlaceholder(/Search/i)
    .first()
    .fill(query);
  await page.getByRole("navigation").getByRole("button", { name: "Search" }).click();
}
