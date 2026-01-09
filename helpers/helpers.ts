import { Page, BrowserContext } from "@playwright/test";

export async function acceptCookies(page: Page): Promise<void> {
  const cookiesPopup = page.getByTestId("notice");
  const acceptButton = page.getByRole("button", { name: "Accept All Cookies" });

  try {
    await acceptButton.waitFor({ state: "visible", timeout: 5000 });
    await acceptButton.click();
    await cookiesPopup.waitFor({ state: "detached", timeout: 5000 });
  } catch {
    console.log("No popup, skipping.");
  }
}

export async function blockAds(target: Page | BrowserContext) {
  await target.route(/googleads|googlesyndication|doubleclick|adservice|adsystem|gpt.js/, (route) => route.abort());
}
