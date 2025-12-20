"use strict";

var runMocha = require("../helpers").runMocha;
var path = require("node:path");

describe("--reporter", function () {
  it("should work for ESM", function (done) {
    runMocha(
      "passing.fixture.js",
      [
        "--reporter",
        path.join(
          __dirname,
          "..",
          "fixtures",
          "options",
          "reporter-esm.fixture.mjs",
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
});
