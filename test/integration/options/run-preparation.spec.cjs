"use strict";

var runMocha = require("../helpers.cjs").runMocha;

describe("run preparation", function () {
  it("should fail when a required module cannot be loaded", function (done) {
    runMocha(
      "passing.fixture.cjs",
      ["--require", "definitely-missing-module"],
      function (err, result) {
        if (err) {
          return done(err);
        }
        expect(result, "to have failed");
        expect(result.output, "to contain", "ERROR:");
        expect(result.output, "to contain", "definitely-missing-module");
        done();
      },
      "pipe",
    );
  });

  it("should fail when a reporter cannot be loaded", function (done) {
    runMocha(
      "passing.fixture.cjs",
      ["--reporter", "definitely-missing-reporter"],
      function (err, result) {
        if (err) {
          return done(err);
        }
        expect(result, "to have failed");
        expect(result.output, "to contain", "ERROR:");
        expect(result.output, "to contain", "definitely-missing-reporter");
        done();
      },
      "pipe",
    );
  });
});
