"use strict";

var helpers = require("../helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;

describe("--ui", function () {
  var simpleUiPath = require.resolve("../fixtures/simple-ui.fixture.cjs");
  var simpleUiESMPath = require.resolve("../fixtures/simple-ui.fixture.js");

  it("should load interface and run it", function (done) {
    runMochaJSON(
      "test-for-simple-ui.fixture.js",
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
      "test-for-simple-ui.fixture.js",
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
      "test-for-simple-ui.fixture.js",
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
      "test-for-simple-ui.fixture.js",
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
