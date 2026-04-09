"use strict";

var path = require("node:path").posix;
var helpers = require("../helpers");
var invokeMochaAsync = helpers.invokeMochaAsync;
var resolveFixturePath = helpers.resolveFixturePath;
var sleep = helpers.sleep;
var runMochaJSON = helpers.runMochaJSON;

describe("--delay", function () {
  var args = ["--delay", "--no-forbid-only"];

  it("should run the generated test suite", function (done) {
    var fixture = path.join("options", "delay");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed").and("to have passed test count", 1);
      done();
    });
  });

  it("should execute exclusive tests only", function (done) {
    var fixture = path.join("options", "delay-only");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed")
        .and("to have passed test count", 2)
        .and(
          "to have passed test order",
          "should run this",
          "should run this, too",
        );
      done();
    });
  });

  it("should throw an error if the test suite failed to run", function (done) {
    var fixture = path.join("options", "delay-fail");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed").and(
        "to have failed test",
        "Uncaught error outside test suite",
      );
      done();
    });
  });

  it("should wait for every delayed child suite before starting the root suite", function (done) {
    var fixture = path.join("options", "delay-per-suite");
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed")
        .and("to have passed test count", 2)
        .and(
          "to have passed tests",
          "suite2 runs after suite1 is ready",
          "suite1 waits for suite2",
        );
      done();
    });
  });

  it("should keep the root suite waiting when a child suite never calls run", async function () {
    var fixture = path.join("options", "delay-never-run");
    var result = invokeMochaAsync(
      [resolveFixturePath(fixture), "--delay", "--reporter", "json"],
      { stdio: "pipe" },
    );
    var mochaProcess = result[0];
    var resultPromise = result[1];

    await sleep(200);
    expect(mochaProcess.exitCode, "to be", null);

    mochaProcess.kill("SIGINT");
    var res = await resultPromise;

    expect(res.code, "to be", 130);
    expect(res.output, "not to contain", "suite3 should never run");
  });
});
