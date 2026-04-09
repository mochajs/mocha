"use strict";

var path = require("node:path").posix;
var helpers = require("../helpers");
var runMochaJSON = helpers.runMochaJSON;

describe("--delay with --grep", function () {
  var args = ["--delay", "--grep", "grep1"];

  it("should run delayed tests matching grep pattern across multiple files", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      // Should have 3 tests that match (1 from each suite)
      expect(res, "to have passed")
        .and("to have passed test count", 3)
        .and(
          "to have passed tests",
          "should match grep1",
          "should match grep1",
          "should match grep1",
        );
      done();
    });
  });

  it("should not run tests that don't match the grep pattern", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      // The "should not match" tests should not be included
      expect(res, "not to have run test", "should not match");
      done();
    });
  });

  it("should work with --invert flag", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(
      fixture,
      ["--delay", "--grep", "grep1", "--invert"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        // Should have 3 tests that don't match "grep1" (the "should not match" ones)
        expect(res, "to have passed")
          .and("to have passed test count", 3)
          .and("to have passed test", "should not match");
        done();
      },
    );
  });

  it("should work with regex patterns", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(
      fixture,
      ["--delay", "--grep", "/match/"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        // Should match both "should match grep1" and "should not match"
        expect(res, "to have passed")
          .and("to have passed test count", 6)
          .and("not to have pending tests");
        done();
      },
    );
  });

  it("should handle case-insensitive regex patterns", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(
      fixture,
      ["--delay", "--grep", "/MATCH/i"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        // Should match both "should match grep1" and "should not match"
        // Case-insensitive matching should find all tests with 'match' in name
        expect(res, "to have passed")
          .and("to have passed test count", 6)
          .and("not to have pending tests");
        done();
      },
    );
  });

  it("should return 0 tests when pattern matches nothing", function (done) {
    var fixture = path.join("options", "delay-grep");
    runMochaJSON(
      fixture,
      ["--delay", "--grep", "nonexistent"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        // Should report 0 tests since no tests match
        expect(res, "not to have tests");
        done();
      },
    );
  });
});
