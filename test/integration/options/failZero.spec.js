"use strict";

var path = require("node:path").posix;
var helpers = require("../helpers");
var runMochaJSON = helpers.runMochaJSON;

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

  describe("with --delay", function () {
    it("should pass when delayed tests are registered (GH-4950)", function (done) {
      var fixture = path.join("options", "delay");
      runMochaJSON(
        fixture,
        ["--fail-zero", "--delay", "--no-forbid-only"],
        function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res, "to have passed").and("to have passed test count", 1);
          done();
        },
      );
    });
  });
});
