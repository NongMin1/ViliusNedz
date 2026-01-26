import { Page, Locator } from "@playwright/test";

export class SearchPage {
  constructor(private readonly page: Page) {}

  // Locators
  private browseNowLink(): Locator {
    return this.page.getByRole("link", { name: "Browse Now" });
  }

  private categoryDropdown(): Locator {
    return this.page.locator("button", { hasText: "All" }).first();
  }

  private searchInput(): Locator {
    return this.page.getByPlaceholder(/Search/i).first();
  }

  private searchButton(): Locator {
    return this.page.getByRole("navigation").getByRole("button", { name: "Search" });
  }

  private categoryOption(name: string): Locator {
    return this.page.getByRole("menuitemradio", { name }).first();
  }

  // Actions
  async openBrowse() {
    await this.browseNowLink().click();
  }

  async selectCategory(option: string) {
    await this.categoryDropdown().scrollIntoViewIfNeeded();
    await this.categoryDropdown().click();

    const optionLocator = this.categoryOption(option);
    await optionLocator.waitFor({ state: "visible" });
    await optionLocator.click();
  }

  async search(query: string, option?: string) {
    await this.openBrowse();

    if (option) {
      await this.selectCategory(option);
    }

    await this.searchInput().fill(query);
    await this.searchButton().click();
  }
}
