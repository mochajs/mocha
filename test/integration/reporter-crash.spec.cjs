"use strict";

const { invokeMochaAsync, resolveFixturePath } = require("./helpers.cjs");

describe("reporter resilience", function () {
  this.timeout(10000);

  it("should exit non-zero and warn (without double-counting) when the reporter throws while handling a failure", async function () {
    const [, promise] = invokeMochaAsync(
      [resolveFixturePath("reporters/listener-throws.fixture.cjs")],
      { stdio: "pipe" },
    );
    const res = await promise;

    expect(res, "to have failed");
    expect(
      res.output,
      "to match",
      /\[mocha\] (reporter error|failed to render)/,
    );
    expect(res.output, "to match", /1 failing/);
    expect(res.output, "not to contain", "2 failing");
  });
});
