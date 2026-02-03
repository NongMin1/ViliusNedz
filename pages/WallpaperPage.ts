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

  async download() {
    const downloadPromise = this.page.waitForEvent("download");

    await this.page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    const modal = this.page.locator('div[class^="Modal_modal"]');
    await modal.waitFor({ state: "detached", timeout: 20000 }).catch(() => {}); //TODO investigate how to fix this place properly

    const downloadsFolder = path.resolve(process.cwd(), "test-results", "downloads");

    const filePath = path.join(downloadsFolder, download.suggestedFilename());

    await download.saveAs(filePath);
    return filePath;
  }
}
