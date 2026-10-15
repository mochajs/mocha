"use strict";

var helpers = require("../helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;

describe("--timeout", function () {
  it("should allow human-readable string value", function (done) {
    runMochaJSON(
      "options/slow-test.fixture.js",
      ["--timeout", "1s"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have failed")
          .and("to have passed test count", 1)
          .and("to have failed test count", 1);
        done();
      },
    );
  });

  it("should allow numeric value", function (done) {
    runMochaJSON(
      "options/slow-test.fixture.js",
      ["--timeout", "1000"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have failed")
          .and("to have passed test count", 1)
          .and("to have failed test count", 1);
        done();
      },
    );
  });

  it("should allow multiple values", function (done) {
    var fixture = "options/slow-test.fixture.js";
    runMochaJSON(
      fixture,
      ["--timeout", "2s", "--timeout", "1000"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have failed")
          .and("to have passed test count", 1)
          .and("to have failed test count", 1);
        done();
      },
    );
  });

  it('should disable timeout with "--inspect"', function (done) {
    var fixture = "options/slow-test.fixture.js";
    runMochaJSON(
      fixture,
      ["--inspect", "--timeout", "200"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 2);
        done();
      },
    );
  });

  it('should disable timeout with "-n inspect"', function (done) {
    var fixture = "options/slow-test.fixture.js";
    runMochaJSON(
      fixture,
      ["-n", "inspect", "--timeout", "200"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 2);
        done();
      },
    );
  });

  it('should disable timeout with "-n inspect=0"', function (done) {
    var fixture = "options/slow-test.fixture.js";
    runMochaJSON(
      fixture,
      ["-n", "inspect=0", "--timeout", "200"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 2);
        done();
      },
    );
  });

  it("should disable timeout when the inspector is enabled via NODE_OPTIONS", function (done) {
    var fixture = "options/slow-test.fixture.js";
    var nodeOptions = process.env.NODE_OPTIONS || "";
    runMochaJSON(
      fixture,
      ["--timeout", "200"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 2);
        done();
      },
      {
        env: {
          ...process.env,
          NODE_OPTIONS: `${nodeOptions} --inspect=0`.trim(),
        },
      },
    );
  });

  it("should disable timeout when the inspector is opened without inspect flags", function (done) {
    var fixture = "options/slow-test.fixture.js";
    runMochaJSON(
      fixture,
      [
        "--require",
        require.resolve("../fixtures/options/open-inspector.fixture.cjs"),
        "--timeout",
        "200",
      ],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 2);
        done();
      },
    );
  });

  it("should complete tests having unref'd async behavior", function (done) {
    runMochaJSON(
      "options/timeout-unref.fixture.js",
      ["--timeout", "0"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed").and("to have passed test count", 1);
        done();
      },
    );
  });
});
