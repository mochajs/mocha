"use strict";

var helpers = require("../helpers");
var runMochaJSON = helpers.runMochaJSON;

describe("--ui", function () {
  var simpleUiPath = require.resolve("../fixtures/simple-ui.fixture.js");
  var simpleUiESMPath = require.resolve("../fixtures/simple-ui.fixture.mjs");

  it("should load interface and run it", function (done) {
    runMochaJSON(
      "test-for-simple-ui",
      ["--ui", simpleUiPath],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed");
        done();
      },
    );
  });

  it("should work if required and name added to Mocha's `interfaces` prop", function (done) {
    runMochaJSON(
      "test-for-simple-ui",
      ["--require", simpleUiPath, "--ui", "simple-ui"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed");
        done();
      },
    );
  });

  it("should work for ESM", function (done) {
    runMochaJSON(
      "test-for-simple-ui",
      ["--require", simpleUiESMPath, "--ui", "simple-ui"],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed");
        done();
      },
    );
  });

  it("should work for ESM when imported via path", function (done) {
    runMochaJSON(
      "test-for-simple-ui",
      ["--ui", simpleUiESMPath],
      function (err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, "to have passed");
        done();
      },
    );
  });
});
