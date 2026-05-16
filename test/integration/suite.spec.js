"use strict";

var run = require("./helpers").runMocha;
var args = [];

describe("suite w/no callback", function () {
  it("should throw a helpful error message when a callback for suite is not supplied", function (done) {
    run(
      "suite/suite-no-callback.fixture.js",
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(
          res.output,
          "to match",
          /no callback was supplied. Supply a callback/,
        );
        done();
      },
      { stdio: "pipe" },
    );
  });
});

describe("skipped suite w/no callback", function () {
  it("should not throw an error when a callback for skipped suite is not supplied", function (done) {
    run(
      "suite/suite-skipped-no-callback.fixture.js",
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        var pattern = /TypeError/g;
        var result = res.output.match(pattern) || [];
        expect(result, "to have length", 0);
        done();
      },
    );
  });
});

describe("skipped suite w/ callback", function () {
  it("should not throw an error when a callback for skipped suite is supplied", function (done) {
    run("suite/suite-skipped-callback.fixture.js", args, function (err, res) {
      if (err) {
        return done(err);
      }
      var pattern = /TypeError/g;
      var result = res.output.match(pattern) || [];
      expect(result, "to have length", 0);
      done();
    });
  });
});

describe("suite returning a plain value", function () {
  it("should not warn when suite callback returns a non-promise value", function (done) {
    run(
      "suite/suite-returning-value.fixture.js",
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, "not to contain output", /returned a promise/);
        done();
      },
      { stdio: "pipe" },
    );
  });
});

describe("suite with async callback", function () {
  it("should warn when suite callback returns a promise", function (done) {
    run(
      "suite/suite-async-callback.fixture.js",
      args,
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, "to contain output", /returned a promise/);
        done();
      },
      { stdio: "pipe" },
    );
  });
});
