"use strict";

const helpers = require("../helpers");
const runMochaAsync = helpers.runMochaAsync;

describe("per-suite and per-test allowUncaught", function () {
  it("bubbles a thrown error when a test opts in via this.allowUncaught()", function () {
    return runMochaAsync("options/allow-uncaught-per-test.fixture.js", [], {
      stdio: "pipe",
    }).then(function (result) {
      expect(result.code, "to be greater than", 0);
      expect(result.output, "to contain", "explicit-per-test");
    });
  });

  it("bubbles a thrown error when a suite opts in via this.allowUncaught()", function () {
    return runMochaAsync("options/allow-uncaught-per-suite.fixture.js", [], {
      stdio: "pipe",
    }).then(function (result) {
      expect(result.code, "to be greater than", 0);
      expect(result.output, "to contain", "explicit-per-suite");
    });
  });
});
