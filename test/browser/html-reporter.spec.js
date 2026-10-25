import { expect, test } from "@playwright/test";

const cases = [
  [
    "IDNA sample",
    "T;  퀬-\uDF7E\uD9AE\uDD23.\u200C\uD804\uDD33\uD95B\uDF38𝟤;  [P1 V6 C1]; [P1 V6 V5 A3]",
  ],
  ["lone high surrogate", "high \uD800"],
  ["lone low surrogate", "low \uDFFF"],
  ["adjacent surrogates", "\uD800\uD800\uDC00\uDC00"],
  ["valid pair", "pair 😀"],
  ["literal escape", "literal \\ud800"],
  ["suite title", "suite \uD800", "suite"],
  ["failed test", "failed \uDFFF", "fail"],
];

for (const [name, value, mode] of cases) {
  test(`HTML reporter replay: ${name}`, async ({ page }) => {
    const suiteTitle = mode === "suite" ? value : "HTML";
    const title = mode === "suite" ? "target" : value;
    const failures = mode === "fail" ? 1 : 0;
    const data = JSON.stringify({ suiteTitle, title, failures });
    await page.route(/\/html-reporter(?:\?|$)/, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><meta charset="utf-8"><div id="mocha"></div>
          <script src="/mocha.js"></script><script>
          mocha.setup({ ui: "bdd", reporter: "html" });
          const data = ${data};
          describe(data.suiteTitle, function () {
            it(data.title, function () {
              if (data.failures) throw new Error("expected failure");
            });
            it("after", function () {});
          });
          const titles = [];
          const runner = mocha.run(function () {
            window.__htmlResults = {
              tests: runner.stats.tests,
              failures: runner.stats.failures,
              titles,
              suiteTitle: runner.suite.suites[0].title
            };
          });
          runner.on("test", function (test) { titles.push(test.title); });
          </script>`,
      }),
    );
    await page.goto("/html-reporter?keep=1");
    const readResults = async () => {
      const handle = await page.waitForFunction(() => window.__htmlResults);
      return handle.jsonValue();
    };
    expect(await readResults()).toEqual({
      tests: 2,
      failures,
      titles: [title, "after"],
      suiteTitle,
    });

    const suiteUrl = await page.locator(".suite h1 a").getAttribute("href");
    const replay = page.locator(".test .replay").first();
    const replayUrl = new URL(await replay.getAttribute("href"), page.url());
    expect(replayUrl.searchParams.get("keep")).toBe("1");
    if (name === "valid pair") {
      expect(replayUrl.searchParams.get("grep")).toBe(`^HTML ${title}$`);
    }
    const pattern = new RegExp(replayUrl.searchParams.get("grep"));
    expect(pattern.test(`${suiteTitle} ${title}`)).toBe(true);
    expect(pattern.test(`${suiteTitle} after`)).toBe(false);

    await replay.click();
    await page.waitForURL((url) => url.searchParams.has("grep"));
    expect(await readResults()).toEqual({
      tests: 1,
      failures,
      titles: [title],
      suiteTitle,
    });

    await page.goto(suiteUrl);
    expect(await readResults()).toEqual({
      tests: 2,
      failures,
      titles: [title, "after"],
      suiteTitle,
    });
  });
}
