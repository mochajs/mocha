import { expect, test } from "@playwright/test";

import { suites } from "./config.js";

for (const indentation of [0, 4, "\t", "  "]) {
  test(`JSON reporter indentation: ${JSON.stringify(indentation)}`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.addScriptTag({ url: "/mocha.js" });
    const result = await page.evaluate((indentation) => {
      let output = "";
      Mocha.process.stdout.write = (chunk) => {
        output += chunk;
      };
      const mocha = new Mocha({
        reporter: "json",
        reporterOption: { indentation },
      });
      mocha.suite.addTest(new Mocha.Test("passes", () => {}));
      return new Promise((resolve) => {
        const runner = mocha.run((failures) => {
          resolve({ failures, output, results: runner.testResults });
        });
      });
    }, indentation);
    expect(result.failures).toBe(0);
    expect(result.results.stats.passes).toBe(1);
    expect(result.output).toBe(
      JSON.stringify(result.results, null, indentation),
    );
  });
}

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

    expect(results.total).toBeGreaterThan(0);
  });
}
