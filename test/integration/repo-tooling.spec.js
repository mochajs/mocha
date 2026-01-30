"use strict";

const { runMochaJSONAsync } = require("./helpers");

describe("repo tooling", function () {
  it("issue-5663: line numbers are wrong in stack traces when running mocha self tests", async function () {
    const output = await runMochaJSONAsync("failing-sync.fixture.js");
    expect(
      output.failures[0].err.stack,
      "to contain",
      // this file needs to be un-excluded from nyc instrumentation, or else this test would fail to catch any
      // issues with nyc instrumentation affecting stack traces.
      "failing-sync.fixture.js:7",
    );
  });
});
