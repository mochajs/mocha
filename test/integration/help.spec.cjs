"use strict";

var invokeMocha = require("./helpers.cjs").invokeMocha;

describe("help", function () {
  it("prints usage, commands and common options", function (done) {
    invokeMocha(
      ["--help"],
      function (err, result) {
        if (err) {
          return done(err);
        }
        expect(result, "to have succeeded");
        expect(result.output, "to contain", "Usage: mocha [spec..]");
        expect(result.output, "to contain", "mocha init <path>");
        expect(result.output, "to contain", "--reporter");
        expect(result.output, "to contain", "--timeout");
        done();
      },
      { stdio: "pipe" },
    );
  });
});
