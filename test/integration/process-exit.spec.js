"use strict";

const { runMochaJSON: run } = require("./helpers");

describe("process.exit() during test execution", function () {
  it("should fail a test that calls process.exit(0) and continue the suite", function (done) {
    run("process-exit-zero", [], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed")
        .and("to have passed test count", 1)
        .and("to have failed test count", 1)
        .and("to have failed test", "should fail when calling process.exit(0)")
        .and(
          "to have passed test",
          "should still run this test after process.exit(0)",
        );

      expect(res.failures[0].err, "to satisfy", {
        code: "ERR_MOCHA_PROCESS_EXIT_DURING_TEST",
        exitCode: 0,
      });

      done();
    });
  });

  it("should fail a test that calls process.exit(1) and continue the suite", function (done) {
    run("process-exit-one", [], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed")
        .and("to have passed test count", 1)
        .and("to have failed test count", 1)
        .and("to have failed test", "should fail when calling process.exit(1)")
        .and(
          "to have passed test",
          "should still run this test after process.exit(1)",
        );

      done();
    });
  });

  it("should handle process.exit in the middle of a suite", function (done) {
    run("process-exit-mixed", [], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed")
        .and("to have passed test count", 2)
        .and("to have failed test count", 1)
        .and("to have failed test", "second test calls process.exit(0)")
        .and("to have passed test", "first test passes")
        .and("to have passed test", "third test should still run");

      done();
    });
  });

  it("should fail the test but continue when process.exit is called asynchronously", function (done) {
    run("process-exit-async", [], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed")
        .and("to have passed test count", 1)
        .and("to have failed test count", 1)
        .and(
          "to have failed test",
          "should fail when calling process.exit(0) in a setTimeout",
        )
        .and(
          "to have passed test",
          "should still run after async process.exit",
        );

      done();
    });
  });

  it("should fail the hook when process.exit is called inside it", function (done) {
    run("process-exit-hook", [], function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have failed")
        .and("to have passed test count", 0)
        .and("to have failed test count", 1);

      expect(res.failures[0].err, "to satisfy", {
        code: "ERR_MOCHA_PROCESS_EXIT_DURING_TEST",
        exitCode: 0,
      });

      done();
    });
  });
});
