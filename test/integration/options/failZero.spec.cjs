"use strict";

var helpers = require("../helpers.cjs");
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

  describe("when used with --parallel", function () {
    var fixture = "options/fail-zero/*.fixture.js";

    it("should pass if only some files have tests matching --grep", function (done) {
      runMochaJSON(
        fixture,
        ["--fail-zero", "--parallel", "--grep", "selected"],
        function (err, res) {
          if (err) {
            return done(err);
          }

          expect(res, "to have passed test count", 1)
            .and("to have test count", 1)
            .and("to have exit code", 0);
          done();
        },
      );
    });

    it("should fail since no tests are encountered", function (done) {
      runMochaJSON(fixture, args.concat("--parallel"), function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res, "to have passed test count", 0)
          .and("to have test count", 0)
          .and("to have exit code", 1);
        done();
      });
    });
  });
});
