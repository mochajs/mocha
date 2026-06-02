import { defineConfig } from "@playwright/test";

import { baseURL } from "./test/browser/config.mjs";

// Playwright configuration for Mocha browser tests.
// Playwright uses its own bundled Chromium (installed via "npx playwright install chromium"), so unlike the old Karma setup, it doesn't depend on a system-installed browser.
export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./test/browser/global-setup.mjs",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "node test/browser/server.mjs",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
