"use strict";

var helpers = require("../helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;
var runMochaJSONAsync = helpers.runMochaJSONAsync;
var resolveFixturePath = helpers.resolveFixturePath;

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

  describe("when used with --parallel and --grep", function () {
    var extraFiles = [
      resolveFixturePath("options/parallel/test-a.fixture.js"),
      resolveFixturePath("passing.fixture.cjs"),
    ];

    it("should pass when matching tests ran in other files", async function () {
      var result = await runMochaJSONAsync(
        "__default__.fixture.js",
        [
          "--fail-zero",
          "--parallel",
          "--jobs",
          "2",
          "--grep",
          "should pass",
        ].concat(extraFiles),
      );

      expect(result, "to have passed")
        .and("to have passed test count", 1)
        .and("to have test count", 1)
        .and("to have exit code", 0);
    });

    it("should fail when no tests match across files", async function () {
      var result = await runMochaJSONAsync(
        "__default__.fixture.js",
        ["--fail-zero", "--parallel", "--jobs", "2", "--grep", "yyyyyy"].concat(
          extraFiles,
        ),
      );

      expect(result, "to have passed test count", 0)
        .and("to have test count", 0)
        .and("to have exit code", 1);
    });
  });
});
