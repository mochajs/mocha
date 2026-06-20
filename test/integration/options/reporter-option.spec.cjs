"use strict";

var runMocha = require("../helpers.cjs").runMocha;
var path = require("node:path");

describe("--reporter-option", function () {
  describe("when given options w/ invalid format", function () {
    it("should display an error", function (done) {
      runMocha(
        "passing.fixture.cjs",
        ["--reporter-option", "foo=bar=baz"],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have failed").and(
            "to contain output",
            /invalid reporter option/i,
          );
          done();
        },
        "pipe",
      );
    });

    it("should allow comma-separated values", function (done) {
      runMocha(
        "passing.fixture.cjs",
        [
          "--reporter",
          path.join(
            __dirname,
            "..",
            "fixtures",
            "options",
            "reporter-with-options.fixture.cjs",
          ),
          "--reporter-option",
          "foo=bar,baz=quux",
        ],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":"bar","baz":"quux"}/,
          );
          done();
        },
        "pipe",
      );
    });

    it("should allow repeated options", function (done) {
      runMocha(
        "passing.fixture.cjs",
        [
          "--reporter",
          path.join(
            __dirname,
            "..",
            "fixtures",
            "options",
            "reporter-with-options.fixture.cjs",
          ),
          "--reporter-option",
          "foo=bar",
          "--reporter-option",
          "baz=quux",
        ],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":"bar","baz":"quux"}/,
          );
          done();
        },
        "pipe",
      );
    });
  });
});
