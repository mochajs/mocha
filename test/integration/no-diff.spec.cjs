"use strict";

var helpers = require("./helpers.cjs");
var run = helpers.runMocha;

describe("no-diff", function () {
  describe("when enabled", function () {
    it("should not display a diff", function (done) {
      run("no-diff.fixture.cjs", ["--no-diff"], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res.output, "not to match", /\+ expected/);
        expect(res.output, "not to match", /- actual/);
        done();
      });
    });
  });

  describe("when disabled", function () {
    it("should display a diff", function (done) {
      run("no-diff.fixture.cjs", ["--diff"], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res.output, "to match", /\+ expected/);
        expect(res.output, "to match", /- actual/);
        done();
      });
    });
  });
});
