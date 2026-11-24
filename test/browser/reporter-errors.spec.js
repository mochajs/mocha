import { expect, test } from "@playwright/test";

for (const event of ["start", "pass", "fail", "end"]) {
  test(`surfaces a ${event} listener exception to the browser`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.addScriptTag({ url: "/mocha.js" });
    const pageError = page.waitForEvent("pageerror");
    await page.evaluate((event) => {
      window.completed = false;
      mocha.setup({
        ui: "bdd",
        reporter: function (runner) {
          runner.on(event, () => {
            throw new Error("reporter failure");
          });
        },
      });
      mocha.suite.addTest(
        new Mocha.Test("test", () => {
          if (event === "fail") throw new Error("test failure");
        }),
      );
      mocha.run(() => {
        window.completed = true;
      });
    }, event);
    expect((await pageError).message).toBe("reporter failure");
    expect(await page.evaluate(() => window.completed)).toBe(false);
  });
}

test("does not complete before a late browser end listener throws", async ({
  page,
}) => {
  await page.goto("/");
  await page.addScriptTag({ url: "/mocha.js" });
  const pageError = page.waitForEvent("pageerror");
  await page.evaluate(() => {
    window.completed = false;
    mocha.setup({ ui: "bdd", reporter: function () {} });
    mocha.suite.addTest(new Mocha.Test("test", function () {}));
    const runner = mocha.run(() => {
      window.completed = true;
    });
    runner.on("end", () => {
      throw new Error("late reporter failure");
    });
  });
  expect((await pageError).message).toBe("late reporter failure");
  expect(await page.evaluate(() => window.completed)).toBe(false);
});

for (const suppress of [false, true]) {
  test(`restores the initial browser error handler (suppress=${suppress})`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate((suppress) => {
      window.hostErrors = [];
      window.originalHandler = (message, url, line, column, error) => {
        window.hostErrors.push(error.message);
        return suppress;
      };
      window.onerror = window.originalHandler;
    }, suppress);
    await page.addScriptTag({ url: "/mocha.js" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.evaluate(() => {
      window.completed = false;
      mocha.setup({
        ui: "bdd",
        reporter: function (runner) {
          runner.on("start", () => {
            throw new Error("reporter failure");
          });
        },
      });
      mocha.suite.addTest(new Mocha.Test("test", function () {}));
      mocha.run(() => {
        window.completed = true;
      });
    });
    await page.waitForFunction(() => window.hostErrors.length === 1);
    expect(
      await page.evaluate(() => ({
        restored: window.onerror === window.originalHandler,
        completed: window.completed,
        errors: window.hostErrors,
      })),
    ).toEqual({
      restored: true,
      completed: false,
      errors: ["reporter failure"],
    });
    expect(errors).toEqual(suppress ? [] : ["reporter failure"]);
  });
}
