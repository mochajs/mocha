"use strict";

var runMocha = require("../helpers.cjs").runMocha;
var invokeMocha = require("../helpers.cjs").invokeMocha;
var path = require("node:path");
var fs = require("node:fs");
var os = require("node:os");
var rimraf = require("rimraf");

var customReporter = path.join(
  __dirname,
  "..",
  "fixtures",
  "options",
  "reporter-with-options.fixture.cjs",
);

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
          customReporter,
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
          customReporter,
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

    it("should allow key-only boolean values", function (done) {
      runMocha(
        "passing.fixture.cjs",
        ["--reporter", customReporter, "--reporter-option", "foo"],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":true}/,
          );
          done();
        },
        "pipe",
      );
    });

    it("should allow the short alias", function (done) {
      runMocha(
        "passing.fixture.cjs",
        ["--reporter", customReporter, "-O", "foo=bar"],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":"bar"}/,
          );
          done();
        },
        "pipe",
      );
    });

    it("should allow the long alias", function (done) {
      runMocha(
        "passing.fixture.cjs",
        ["--reporter", customReporter, "--reporter-options", "foo=bar"],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":"bar"}/,
          );
          done();
        },
        "pipe",
      );
    });

    it("should preserve package config reporter options after respawning with a Node option", function (done) {
      var tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-reporter-option-"));
      fs.writeFileSync(
        path.join(tmpdir, "package.json"),
        JSON.stringify({
          mocha: {
            reporter: customReporter,
            "reporter-option": ["foo=bar"],
            spec: [path.join(__dirname, "..", "fixtures", "passing.fixture.cjs")],
          },
        }),
      );

      invokeMocha(
        ["--node-option", "trace-warnings"],
        function (err, res) {
          rimraf.sync(tmpdir);
          if (err) {
            return done(err);
          }
          expect(res, "to have passed").and(
            "to contain output",
            /{"foo":"bar"}/,
          );
          done();
        },
        { cwd: tmpdir, stdio: "pipe" },
      );
    });
  });
});
