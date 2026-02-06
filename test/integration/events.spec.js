"use strict";

var { expect } = require("chai");

var helpers = require("./helpers");
var runMochaJSON = helpers.runMochaJSON;

describe("event order", function () {
  describe("trivial test case", function () {
    it("should assert trivial event order", function (done) {
      runMochaJSON("runner/events-basic.fixture.js", [], function (err, res) {
        if (err) {
          done(err);
          return;
        }

        expect(res.failures.length).to.equal(0);
        expect(res.passes.length).to.equal(2);
        expect(res.passes.map(t => t.title)).to.deep.equal(["test A", "test B"]);
        done();
      });
    });
  });

  describe("--bail test case", function () {
    it("should assert --bail event order", function (done) {
      runMochaJSON(
        "runner/events-bail.fixture.js",
        ["--bail"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }

          expect(res.failures.length).to.equal(1);
          expect(res.failures[0].err.message).to.equal("error test A");
          expect(res.passes.length).to.equal(0);
          done();
        },
      );
    });
  });

  describe("--retries test case", function () {
    it("should assert --retries event order", function (done) {
      runMochaJSON(
        "runner/events-retries.fixture.js",
        ["--retries", "1"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }

          expect(res.failures[0].err.message).to.equal("error test A");
          expect(res.failures.length).to.equal(1);
          expect(res.passes.length).to.equal(0);
          done();
        },
      );
    });
  });

  describe("--delay test case", function () {
    it("should assert --delay event order", function (done) {
      runMochaJSON(
        "runner/events-delay.fixture.js",
        ["--delay"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }

          expect(res.failures.length).to.equal(0);
          expect(res.passes.length).to.equal(2);
          expect(res.passes[0].title).to.equal("test A")
          expect(res.passes[1].title).to.equal("test B");
          done();
        },
      );
    });
  });

  describe("--retries and --bail test case", function () {
    it("should assert --retries event order", function (done) {
      runMochaJSON(
        "runner/events-bail-retries.fixture.js",
        ["--retries", "1", "--bail"],
        function (err, res) {
          if (err) {
            done(err);
            return;
          }

          expect(res.failures.length).to.equal(1);
          expect(res.passes.length).to.equal(0);
          expect(res.failures[0].err.message).to.equal("error test A");
          done();
        },
      );
    });
  });
});
