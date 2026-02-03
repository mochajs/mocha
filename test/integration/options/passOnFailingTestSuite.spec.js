"use strict";

var helpers = require("../helpers");
var runMochaJSON = helpers.runMochaJSON;

describe("Enabled --pass-on-failing-test-suite", function () {
  var args = ["--pass-on-failing-test-suite=true"];

  it("Test should finish with zero code with disabled option", function (done) {
    var fixture = "failing-sync.fixture.js";
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed test count", 0)
        .and("to have test count", 1)
        .and("to have exit code", 0);
      done();
    });
  });
});

describe("Disabled --pass-on-failing-test-suite", function () {
  var args = ["--pass-on-failing-test-suite=false"];

  it("Test should return non-zero code with enabled option", function (done) {
    var fixture = "failing-sync.fixture.js";
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, "to have passed test count", 0)
        .and("to have test count", 1)
        .and("to have exit code", 1);
      done();
    });
  });
});
