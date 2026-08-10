"use strict";

var path = require("node:path").posix;
var helpers = require("../helpers.cjs");
var invokeMochaAsync = helpers.invokeMochaAsync;
var resolveFixturePath = helpers.resolveFixturePath;
var runMochaJSON = helpers.runMochaJSON;
var runMochaJSONAsync = helpers.runMochaJSONAsync;

var FIXTURE = path.join("options", "order.fixture.js");

// `STDERR` piped separately, so it does not corrupt the JSON reporter output
var SEPARATE_STDERR = {
  stdio: ["inherit", "pipe", "pipe"],
  separateStderr: true,
};

describe("--order", function () {
  it("should run tests in a reproducible shuffled order given a seed", function (done) {
    runMochaJSON(
      FIXTURE,
      ["--order", "random:42"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed test count", 6).and(
          "to have passed test order",
          "root test",
          "two",
          "one",
          "three",
          "four",
          "five",
        );
        done();
      },
      SEPARATE_STDERR,
    );
  });

  it("should shuffle sibling suites as well as tests", function (done) {
    runMochaJSON(
      FIXTURE,
      ["--order", "random:1337"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed test count", 6).and(
          "to have passed test order",
          "root test",
          "five",
          "four",
          "one",
          "two",
          "three",
        );
        done();
      },
      SEPARATE_STDERR,
    );
  });

  it("should report the seed used", function (done) {
    runMochaJSON(
      FIXTURE,
      ["--order", "random:42"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res.stderr, "to match", /randomized with seed 42/);
        done();
      },
      SEPARATE_STDERR,
    );
  });

  it("should generate a seed which reproduces the order when given back", async function () {
    var firstRun = await runMochaJSONAsync(
      FIXTURE,
      ["--order", "random"],
      SEPARATE_STDERR,
    );
    var match = /randomized with seed (\d+)/.exec(firstRun.stderr);
    expect(match, "to be truthy");
    var seed = match[1];
    var secondRun = await runMochaJSONAsync(
      FIXTURE,
      ["--order", "random:" + seed],
      SEPARATE_STDERR,
    );
    expect(secondRun, "to have passed test count", 6).and(
      "to have passed test order",
      firstRun.passes.map(function (test) {
        return test.title;
      }),
    );
  });

  it("should run tests in declaration order given 'default'", function (done) {
    runMochaJSON(FIXTURE, ["--order", "default"], function (err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, "to have passed test count", 6).and(
        "to have passed test order",
        "root test",
        "one",
        "two",
        "three",
        "four",
        "five",
      );
      done();
    });
  });

  describe("when used with --sort", function () {
    it("should error out", function () {
      return expect(
        invokeMochaAsync(
          ["--sort", "--order", "random", resolveFixturePath(FIXTURE)],
          "pipe",
        )[1],
        "when fulfilled",
        "to satisfy",
        {
          code: 1,
          output: /--sort and --order random are mutually exclusive/,
        },
      );
    });
  });

  describe("when given an invalid value", function () {
    it("should error out", function () {
      return expect(
        invokeMochaAsync(
          ["--order", "banana", resolveFixturePath(FIXTURE)],
          "pipe",
        )[1],
        "when fulfilled",
        "to satisfy",
        {
          code: 1,
          output: /invalid order 'banana'/,
        },
      );
    });
  });
});
