import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  reporter: [["list"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/results.xml" }]],
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: process.env.BASE_URL,
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    launchOptions: {
      args: ["--disable-extensions", "--disable-infobars"],
    },
  },
});
