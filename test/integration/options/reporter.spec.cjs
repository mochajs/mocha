"use strict";

var runMocha = require("../helpers.cjs").runMocha;
var path = require("node:path");

describe("--reporter", function () {
  it("should work for ESM", function (done) {
    runMocha(
      "passing.fixture.cjs",
      [
        "--reporter",
        path.join(
          __dirname,
          "..",
          "fixtures",
          "options",
          "reporter-esm.fixture.js",
        ),
      ],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, "to have passed");
        done();
      },
      "inherit",
    );
  });

  it("should fail with a meaningful error for the HTML reporter", function (done) {
    runMocha(
      "passing.fixture.cjs",
      ["--reporter", "html"],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(
          res,
          "to have failed with output",
          /HTML reporter is only supported in a browser/,
        );
        done();
      },
      { stdio: "pipe" },
    );
  });
});
