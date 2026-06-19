"use strict";

const { invokeMochaAsync, resolveFixturePath } = require("./helpers");

describe("reporter resilience", function () {
  this.timeout(10000);

  let res;

  before(async function () {
    const [, promise] = invokeMochaAsync(
      [resolveFixturePath("reporters/listener-throws")],
      { stdio: "pipe" },
    );
    res = await promise;
  });

  it("should exit non-zero when the reporter throws while handling a failure", function () {
    expect(res, "to have failed");
  });

  it("should warn that the reporter threw instead of crashing", function () {
    expect(
      res.output,
      "to match",
      /\[mocha\] (reporter error|failed to render)/,
    );
  });

  it("should report the failure exactly once, not double-count the reporter throw", function () {
    expect(res.output, "to match", /1 failing/);
    expect(res.output, "not to contain", "2 failing");
  });
});
