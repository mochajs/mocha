"use strict";

var path = require("node:path").posix;
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

  it("should pass when a delayed test runs", function (done) {
    var fixture = path.join("options", "delay.fixture.cjs");
    runMochaJSON(fixture, ["--fail-zero", "--delay"], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed test count", 1)
        .and("to have test count", 1)
        .and("to have exit code", 0);
      done();
    });
  });

  it("should fail when grep excludes every delayed test", function (done) {
    var fixture = path.join("options", "delay.fixture.cjs");
    runMochaJSON(
      fixture,
      ["--fail-zero", "--delay", "--grep", "yyyyyy"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res, "to have passed test count", 0)
          .and("to have test count", 0)
          .and("to have exit code", 1);
        done();
      },
    );
  });

  it("should fail when invert excludes every delayed test", function (done) {
    var fixture = path.join("options", "delay.fixture.cjs");
    runMochaJSON(
      fixture,
      ["--fail-zero", "--delay", "--grep", "delayed execution", "--invert"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res, "to have passed test count", 0)
          .and("to have test count", 0)
          .and("to have exit code", 1);
        done();
      },
    );
  });

  it("should count exclusive delayed tests", function (done) {
    var fixture = path.join("options", "delay-only.fixture.cjs");
    runMochaJSON(
      fixture,
      ["--fail-zero", "--delay", "--no-forbid-only"],
      function (err, res) {
        if (err) {
          return done(err);
        }

        expect(res, "to have passed test count", 2)
          .and("to have test count", 2)
          .and("to have exit code", 0);
        done();
      },
    );
  });
});
