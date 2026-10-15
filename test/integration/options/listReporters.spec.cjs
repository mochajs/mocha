"use strict";

var helpers = require("../helpers.cjs");
var invokeMocha = helpers.invokeMocha;
var escapeRegExp = helpers.escapeRegExp;
var reporters = require("../../../lib/mocha.cjs").reporters;

var NOT_LISTED = ["base", "html"];

describe("--list-reporters", function () {
  var expected = Object.keys(reporters).filter(function (name) {
    return /^[a-z]/.test(name) && !NOT_LISTED.includes(name);
  });

  it("should dump a list of all reporters with descriptions", function (done) {
    expect(expected.length, "to be greater than", 0);

    invokeMocha(["--list-reporters"], function (err, result) {
      if (err) {
        return done(err);
      }

      expect(result.code, "to be", 0);
      expected.forEach(function (name) {
        expect(
          result.output,
          "to match",
          new RegExp(
            escapeRegExp(name) +
              "\\s*-\\s*" +
              escapeRegExp(reporters[name].description),
          ),
        );
      });
      done();
    });
  });

  it("should not dump reporters unavailable on the command line", function (done) {
    invokeMocha(["--list-reporters"], function (err, result) {
      if (err) {
        return done(err);
      }

      expect(result.code, "to be", 0);
      NOT_LISTED.forEach(function (name) {
        expect(
          result.output,
          "not to match",
          new RegExp("^\\s*" + escapeRegExp(name) + "\\s", "m"),
        );
      });
      done();
    });
  });

  it("should fail when combined with another one-and-done option", function (done) {
    invokeMocha(
      ["--list-reporters", "--list-interfaces"],
      function (err, result) {
        if (err) {
          return done(err);
        }
        expect(
          result,
          "to have failed with output",
          /Arguments list-interfaces and list-reporters are mutually exclusive/,
        );
        done();
      },
      { stdio: "pipe" },
    );
  });
});
