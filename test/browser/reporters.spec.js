import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.addScriptTag({ url: "/mocha.js" });
});

async function runReporter(page, reporter, reporterOptions = {}, fail = true) {
  const output = [];
  page.on("console", (message) => {
    if (message.type() === "log") output.push(message.text());
  });

  const failures = await page.evaluate(
    ({ reporter, reporterOptions, fail }) => {
      const { Mocha } = window;
      const mocha = new Mocha({ reporter, reporterOptions, color: false });
      const suite = Mocha.Suite.create(mocha.suite, "browser reporters");
      const tests = [
        new Mocha.Test("passes asynchronously", async () => {
          await Promise.resolve();
        }),
        new Mocha.Test("is pending"),
      ];
      if (fail) {
        tests.push(
          new Mocha.Test("fails", () => {
            const error = new Error("expected <value> & 50%\nsecond line");
            error.stack =
              error.message +
              "\n    at Context.<anonymous> (/spec/browser.spec.js:12:34)";
            throw error;
          }),
        );
      }
      for (const runnable of tests) {
        runnable.file = "/fixtures/../spec/browser.spec.js";
        suite.addTest(runnable);
      }

      return new Promise((resolve) => {
        mocha.run((failures) => {
          // Wait for browser-stdout's queued writes and process.nextTick callbacks.
          Mocha.process.stdout.write("", () => resolve(failures));
        });
      });
    },
    { reporter, reporterOptions, fail },
  );

  return { failures, output: output.join("\n") };
}

test("JSON reporter writes browser results to stdout", async ({ page }) => {
  const { failures, output } = await runReporter(page, "json");

  expect(failures).toBe(1);
  const results = JSON.parse(output);
  expect(results).toMatchObject({
    stats: { tests: 3, passes: 1, pending: 1, failures: 1 },
    tests: [
      { title: "passes asynchronously" },
      { title: "is pending" },
      { title: "fails" },
    ],
    passes: [{ fullTitle: "browser reporters passes asynchronously" }],
    pending: [{ fullTitle: "browser reporters is pending" }],
    failures: [
      {
        fullTitle: "browser reporters fails",
        file: "/fixtures/../spec/browser.spec.js",
        err: { message: "expected <value> & 50%\nsecond line" },
      },
    ],
  });
});

for (const showRelativePaths of [false, true]) {
  test(`XUnit reporter writes browser XML with relative paths ${showRelativePaths}`, async ({
    page,
  }) => {
    const { failures, output } = await runReporter(page, "xunit", {
      suiteName: "Browser <reporters> & results",
      showRelativePaths,
    });

    expect(failures).toBe(1);
    const xml = await page.evaluate((output) => {
      const document = new DOMParser().parseFromString(output, "text/xml");
      return {
        errors: document.querySelectorAll("parsererror").length,
        suite: Object.fromEntries(
          Array.from(document.documentElement.attributes, ({ name, value }) => [
            name,
            value,
          ]),
        ),
        tests: Array.from(document.querySelectorAll("testcase"), (test) => ({
          name: test.getAttribute("name"),
          file: test.getAttribute("file"),
          skipped: !!test.querySelector("skipped"),
          failure: test.querySelector("failure")?.textContent ?? null,
        })),
      };
    }, output);
    expect(xml.errors).toBe(0);
    expect(xml.suite).toMatchObject({
      name: "Browser <reporters> & results",
      tests: "3",
      errors: "1",
      skipped: "1",
    });
    expect(xml.tests).toEqual([
      expect.objectContaining({
        name: "passes asynchronously",
        skipped: false,
        failure: null,
      }),
      expect.objectContaining({ name: "is pending", skipped: true }),
      expect.objectContaining({
        name: "fails",
        failure: expect.stringContaining("expected <value> & 50%\nsecond line"),
      }),
    ]);
    for (const result of xml.tests) {
      expect(result.file).toBe(
        showRelativePaths
          ? "spec/browser.spec.js"
          : "/fixtures/../spec/browser.spec.js",
      );
    }
  });
}

for (const reporter of ["json", "xunit"]) {
  test(`${reporter} reporter rejects file output in the browser`, async ({
    page,
  }) => {
    const error = await page.evaluate((reporter) => {
      const mocha = new window.Mocha({
        reporter,
        reporterOptions: { output: "reports/results.txt" },
      });
      try {
        mocha.run();
      } catch ({ code, message }) {
        return { code, message };
      }
      return null;
    }, reporter);

    expect(error).toEqual({
      code: "ERR_MOCHA_UNSUPPORTED",
      message: "file output not supported in browser",
    });
  });
}

test("GitHub Actions reporter writes browser failure annotations", async ({
  page,
}) => {
  const { failures, output } = await runReporter(page, "github-actions");

  expect(failures).toBe(1);
  expect(output).toContain("::group::Mocha Annotations\n");
  expect(output).toContain(
    "::error file=/spec/browser.spec.js,line=12,col=34::expected <value> & 50%25%0Asecond line\n",
  );
  expect(output).toContain("::endgroup::\n");
});

test("GitHub Actions reporter completes browser runs without failures", async ({
  page,
}) => {
  const { failures, output } = await runReporter(
    page,
    "github-actions",
    {},
    false,
  );

  expect(failures).toBe(0);
  expect(output).toContain("passes asynchronously");
  expect(output).toContain("is pending");
  expect(output).not.toContain("::error");
  expect(output).not.toContain("::group::");
});
