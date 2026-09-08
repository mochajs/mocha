"use strict";

const { runMochaAsync } = require("./helpers.cjs");

describe("common js require", function () {
  this.timeout(10000);

  it("should be able to run a test where all mocha exports are used", async function () {
    const result = await runMochaAsync("common-js-require.fixture.cjs", [
      "--delay",
      "--ui",
      "require",
      "--no-forbid-only",
    ]);
    expect(result, "to satisfy", {
      failing: 0,
      passing: 5,
      pending: 0,
    });
    expect(result.output, "to contain", "running before");
    expect(result.output, "to contain", "running suiteSetup");
    expect(result.output, "to contain", "running setup");
    expect(result.output, "to contain", "running beforeEach");
    expect(result.output, "to contain", "running it.only");
    expect(result.output, "to contain", "running specify.only");
    expect(result.output, "to contain", "running test.only");
    expect(result.output, "to contain", "running context.only");
    expect(result.output, "to contain", "running suite.only");
    expect(result.output, "to contain", "running afterEach");
    expect(result.output, "to contain", "running teardown");
    expect(result.output, "to contain", "running suiteTeardown");
    expect(result.output, "to contain", "running after");
  });
});
