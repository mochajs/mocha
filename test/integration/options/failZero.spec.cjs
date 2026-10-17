"use strict";

var assert = require("node:assert");
var helpers = require("../helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;
var runMochaJSONAsync = helpers.runMochaJSONAsync;

describe("--fail-zero", function () {
  var args = ["--fail-zero", "--grep", "yyyyyy"];

  it("should fail since no tests are encountered", function (done) {
    var fixture = "__default__.fixture.js";
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed test count", 0)
        .and("to have test count", 0)
        .and("to have exit code", 1);
      done();
    });
  });

  // https://github.com/mochajs/mocha/issues/4969
  it("should not fail in parallel mode when grep matches a test in at least one file", async function () {
    var result = await runMochaJSONAsync("parallel/test1.js", [
      "--fail-zero",
      "--parallel",
      "--jobs",
      "2",
      "--grep",
      "test1",
      require.resolve("../fixtures/parallel/test2.js"),
    ]);

    assert.strictEqual(result.stats.passes, 1);
    assert.strictEqual(result.stats.failures, 0);
    assert.strictEqual(result.code, 0);
  });

  it("should still fail in parallel mode when grep matches no tests", async function () {
    var result = await runMochaJSONAsync("parallel/test1.js", [
      "--fail-zero",
      "--parallel",
      "--jobs",
      "2",
      "--grep",
      "yyyyyy",
      require.resolve("../fixtures/parallel/test2.js"),
    ]);

    assert.strictEqual(result.stats.passes, 0);
    assert.strictEqual(result.code, 1);
  });
});
