// Runs each Mocha browser suite in a real Chromium page via Playwright and asserts that every test passed. This replaces the previous Karma setup.

import { expect, test } from "@playwright/test";

import { suites } from "./config.mjs";

for (const suite of suites) {
  test(`browser suite: ${suite.name}`, async ({ page }) => {
    await page.goto(`/run/${suite.name}`);

    const results = await page
      .waitForFunction(() => window.__mochaResults, null, { timeout: 30_000 })
      .then((handle) => handle.jsonValue());

    const report = results.failures
      .map((failure) => `\n  ✗ ${failure.title}\n    ${failure.message}`)
      .join("");
    expect(results.failures, `mocha reported failures:${report}`).toHaveLength(
      0,
    );

    // Needed to guard against a page that silently ran zero tests.
    expect(results.total).toBeGreaterThan(0);
  });
}
