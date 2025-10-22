"use strict";

var helpers = require("../helpers");
var runMocha = helpers.runMocha;
var os = require("node:os");

const EXIT_FAILURE = 1;
const SIGNAL_OFFSET = 128;

describe("--posix-exit-codes", function () {
  if (os.platform() !== "win32") {
    describe("when enabled", function () {
      describe("when mocha is run as a child process", () => {
        // 'no-warnings' node option makes mocha run as a child process
        const args = ["--no-warnings", "--posix-exit-codes"];

        it("should exit with correct POSIX shell code on SIGABRT", function (done) {
          var fixture = "signals-sigabrt.fixture.js";
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(
              res.code,
              "to be",
              SIGNAL_OFFSET + os.constants.signals.SIGABRT,
            );
            done();
          });
        });

        it("should exit with correct POSIX shell code on SIGTERM", function (done) {
          // SIGTERM is not supported on Windows
          if (os.platform() !== "win32") {
            var fixture = "signals-sigterm.fixture.js";
            runMocha(fixture, args, function postmortem(err, res) {
              if (err) {
                return done(err);
              }
              expect(
                res.code,
                "to be",
                SIGNAL_OFFSET + os.constants.signals.SIGTERM,
              );
              done();
            });
          } else {
            done();
          }
        });

        it("should exit with the correct POSIX shell code on numeric fatal signal", function (done) {
          // not supported on Windows
          if (os.platform() !== "win32") {
            var fixture = "signals-sigterm-numeric.fixture.js";
            runMocha(fixture, args, function postmortem(err, res) {
              if (err) {
                return done(err);
              }
              expect(
                res.code,
                "to be",
                SIGNAL_OFFSET + os.constants.signals.SIGTERM,
              );
              done();
            });
          } else {
            done();
          }
        });

        it("should exit with code 1 if there are test failures", function (done) {
          var fixture = "failing.fixture.js";
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(res.code, "to be", EXIT_FAILURE);
            done();
          });
        });
      });

      describe("when mocha is run in-process", () => {
        // Without node-specific cli options, mocha runs in-process
        const args = ["--posix-exit-codes"];

        it("should exit with the correct POSIX shell code on SIGABRT", function (done) {
          var fixture = "signals-sigabrt.fixture.js";
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(
              res.code,
              "to be",
              SIGNAL_OFFSET + os.constants.signals.SIGABRT,
            );
            done();
          });
        });

        it("should exit with the correct POSIX shell code on SIGTERM", function (done) {
          // SIGTERM is not supported on Windows
          if (os.platform() !== "win32") {
            var fixture = "signals-sigterm.fixture.js";
            runMocha(fixture, args, function postmortem(err, res) {
              if (err) {
                return done(err);
              }
              expect(
                res.code,
                "to be",
                SIGNAL_OFFSET + os.constants.signals.SIGTERM,
              );
              done();
            });
          } else {
            done();
          }
        });

        it("should exit with code 1 if there are test failures", function (done) {
          var fixture = "failing.fixture.js";
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(res.code, "to be", EXIT_FAILURE);
            done();
          });
        });
      });
    });

    describe("when not enabled", function () {
      describe("when mocha is run as a child process", () => {
        // any node-specific option makes mocha run as a child process
        var args = ["--no-warnings"];

        it("should exit with the number of failed tests", function (done) {
          var fixture = "failing.fixture.js";
          var numFailures = 3;
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(res.code, "to be", numFailures);
            done();
          });
        });
      });

      describe("when mocha is run in-process", () => {
        var args = [];

        it("should exit with the number of failed tests", function (done) {
          var fixture = "failing.fixture.js";
          var numFailures = 3;
          runMocha(fixture, args, function postmortem(err, res) {
            if (err) {
              return done(err);
            }
            expect(res.code, "to be", numFailures);
            done();
          });
        });
      });
    });
  }
});
