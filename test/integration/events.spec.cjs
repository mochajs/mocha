"use strict";

var helpers = require("./helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;

describe("event order", function () {
  describe("trivial test case", function () {
    it("should assert trivial event order", function (done) {
      runMochaJSON("runner/events-basic.fixture.cjs", [], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed")
          .and("to have passed test count", 2)
          .and("to have passed test order", "test A", "test B")
          .and("to have failed test count", 0);
        done();
      });
    });
  });

  describe("--bail test case", function () {
    it("should assert --bail event order", function (done) {
      runMochaJSON(
        "runner/events-bail.fixture.cjs",
        ["--bail"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, "to have failed with error", "error test A")
            .and("to have failed test count", 1)
            .and("to have passed test count", 0);
          done();
        },
      );
    });
  });

  describe("--retries test case", function () {
    it("should assert --retries event order", function (done) {
      runMochaJSON(
        "runner/events-retries.fixture.cjs",
        ["--retries", "1"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, "to have failed with error", "error test A")
            .and("to have failed test count", 1)
            .and("to have passed test count", 0);
          done();
        },
      );
    });
  });

  describe("--delay test case", function () {
    it("should assert --delay event order", function (done) {
      runMochaJSON(
        "runner/events-delay.fixture.cjs",
        ["--delay"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, "to have passed")
            .and("to have passed test count", 2)
            .and("to have passed test order", "test A", "test B")
            .and("to have failed test count", 0);
          done();
        },
      );
    });
  });

  describe("--retries and --bail test case", function () {
    it("should assert --retries event order", function (done) {
      runMochaJSON(
        "runner/events-bail-retries.fixture.cjs",
        ["--retries", "1", "--bail"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, "to have failed with error", "error test A")
            .and("to have failed test count", 1)
            .and("to have passed test count", 0);
          done();
        },
      );
    });
  });
});
