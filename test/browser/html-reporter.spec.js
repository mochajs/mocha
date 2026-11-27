import { expect, test } from "@playwright/test";

async function startReport(page) {
  await page.goto("/");
  await page.setContent(
    '<div class="suite hidden" id="unrelated">Unrelated content</div><div id="mocha"></div>',
  );
  await page.addStyleTag({ url: "/mocha.css" });
  await page.addScriptTag({ url: "/mocha.js" });
  await page.evaluate(() => {
    mocha.setup({ ui: "bdd", reporter: "html" });
    let step = 0;
    function pause(value) {
      window.reportStep = value;
      return new Promise((resolve) => {
        window.resumeReport = resolve;
      });
    }
    before(function () {
      this.timeout(0);
      return pause(0);
    });
    afterEach(function () {
      this.timeout(0);
      return pause(++step);
    });
    describe("First group", () => {
      it("first pass", () => {});
      it("first failure", () => {
        throw new Error("Expected example failure");
      });
    });
    describe("Later group", () => {
      describe("Passing child", () => {
        it("later pass", () => {});
      });
      describe("Failing child", () => {
        it("later failure", () => {
          throw new Error("Expected example failure");
        });
      });
      describe("Pending child", () => {
        it("pending test");
      });
    });
    mocha.run(() => {
      window.reportFinished = true;
    });
  });
  await page.waitForFunction(() => window.reportStep === 0);
}

async function advanceReport(page, step) {
  await page.evaluate(() => {
    window.reportStep = undefined;
    window.resumeReport();
  });
  if (step === undefined) {
    await page.waitForFunction(() => window.reportFinished);
  } else {
    await page.waitForFunction((value) => window.reportStep === value, step);
  }
}

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true });
}

for (const filter of ["passes", "failures"]) {
  test(`HTML reporter keeps the ${filter} filter current during a run`, async ({
    page,
  }) => {
    await startReport(page);
    const passing = filter === "passes";
    const link = page.locator(`#mocha-stats .${filter} a`);
    await link.click();

    await advanceReport(page, 1);
    await expect(heading(page, "First group")).toBeVisible({
      visible: passing,
    });
    await advanceReport(page, 2);
    await expect(heading(page, "First group")).toBeVisible();

    await advanceReport(page, 3);
    await expect(heading(page, "Later group")).toBeVisible({
      visible: passing,
    });
    await expect(heading(page, "Passing child")).toBeVisible({
      visible: passing,
    });

    // Switching filters must use results that have already arrived.
    const opposite = page.locator(
      `#mocha-stats .${passing ? "failures" : "passes"} a`,
    );
    await opposite.click();
    await expect(heading(page, "Later group")).toBeVisible({
      visible: !passing,
    });
    await link.click();

    await advanceReport(page, 4);
    await expect(heading(page, "Later group")).toBeVisible();
    await expect(heading(page, "Failing child")).toBeVisible({
      visible: !passing,
    });
    await expect(heading(page, "Passing child")).toBeVisible({
      visible: passing,
    });

    await advanceReport(page);
    // Pending tests retain their existing inclusion in the passes filter.
    await expect(heading(page, "Pending child")).toBeVisible({
      visible: passing,
    });
    await expect(page.locator("#mocha-report .test.pass:visible")).toHaveCount(
      passing ? 3 : 0,
    );
    await expect(page.locator("#mocha-report .test.fail:visible")).toHaveCount(
      passing ? 0 : 2,
    );

    await link.click();
    await expect(page.locator("#mocha-report .suite:visible")).toHaveCount(5);
    await expect(page.locator("#mocha-report .test:visible")).toHaveCount(5);
    await link.click();
    await expect(heading(page, "Pending child")).toBeVisible({
      visible: passing,
    });
  });
}

test("HTML reporter hides passing-only groups added after selecting failures", async ({
  page,
}) => {
  await startReport(page);
  await advanceReport(page, 1);
  await advanceReport(page, 2);
  await page.locator("#mocha-stats .failures a").click();
  await expect(heading(page, "First group")).toBeVisible();

  await advanceReport(page, 3);
  await expect(heading(page, "Later group")).toBeHidden();
  await expect(heading(page, "Passing child")).toBeHidden();

  await advanceReport(page, 4);
  await expect(heading(page, "Later group")).toBeVisible();
  await expect(heading(page, "Failing child")).toBeVisible();
  await expect(heading(page, "Passing child")).toBeHidden();
  await advanceReport(page);
});

test("HTML reporter filters leave unrelated suite elements unchanged", async ({
  page,
}) => {
  await startReport(page);
  await page.locator("#mocha-stats .passes a").click();
  await expect(page.locator("#unrelated")).toHaveClass("suite hidden");
  await page.locator("#mocha-stats .passes a").click();
  await expect(page.locator("#unrelated")).toHaveClass("suite hidden");
  await page.locator("#mocha-stats .failures a").click();
  await expect(page.locator("#unrelated")).toHaveClass("suite hidden");
  for (const step of [1, 2, 3, 4, undefined]) {
    await advanceReport(page, step);
  }
});

test("HTML reporter still filters tests in the root suite", async ({
  page,
}) => {
  await page.goto("/");
  await page.setContent('<div id="mocha"></div>');
  await page.addStyleTag({ url: "/mocha.css" });
  await page.addScriptTag({ url: "/mocha.js" });
  await page.evaluate(() => {
    mocha.setup({ ui: "bdd", reporter: "html" });
    it("root pass", () => {});
    it("root failure", () => {
      throw new Error("Expected example failure");
    });
    it("root pending");
    mocha.run(() => {
      window.reportFinished = true;
    });
  });
  await page.waitForFunction(() => window.reportFinished);
  await page.locator("#mocha-stats .failures a").click();
  await expect(page.locator("#mocha-report .test:visible")).toHaveCount(1);
  await expect(page.locator("#mocha-report .test.fail")).toBeVisible();
  await page.locator("#mocha-stats .passes a").click();
  await expect(page.locator("#mocha-report .test:visible")).toHaveCount(2);
  await expect(page.locator("#mocha-report .test.fail")).toBeHidden();
});
