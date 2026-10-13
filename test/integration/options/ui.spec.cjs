"use strict";

var path = require("node:path");
var helpers = require("../helpers.cjs");
var invokeMocha = helpers.invokeMocha;
var runMochaJSON = helpers.runMochaJSON;
var toJSONResult = helpers.toJSONResult;

describe("--ui", function () {
  this.timeout(10000);

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

  it("should support the built-in require interface for CommonJS", function (done) {
    runMochaJSON(
      "options/require-interface.fixture.cjs",
      ["--ui", "require"],
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

  it("should support the built-in require interface for ESM", function (done) {
    runMochaJSON(
      "options/require-interface.fixture.mjs",
      ["--ui", "require"],
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

  it("should support the built-in require interface via config", function (done) {
    var cwd = path.join(
      __dirname,
      "..",
      "fixtures",
      "options",
      "require-config",
    );

    invokeMocha(
      ["--reporter", "json", "require-config.fixture.cjs"],
      function (err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(toJSONResult(result), "to have passed");
        done();
      },
      { cwd: cwd },
    );
  });
});
