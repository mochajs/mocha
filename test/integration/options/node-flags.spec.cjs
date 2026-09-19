"use strict";

var path = require("node:path");
var pathToFileURL = require("node:url").pathToFileURL;
var invokeMocha = require("../helpers.cjs").invokeMocha;
var runMochaAsync = require("../helpers.cjs").runMochaAsync;

describe("node flags", function () {
  it("should not consider argument values to be node flags", function (done) {
    invokeMocha(
      ["--require", "trace-dependency"],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, "not to have failed with output", /bad option/i);
        done();
      },
      "pipe",
    );
  });
});

describe('node flags using "--node-option"', function () {
  it("should pass fake option to node and fail with node exception", function (done) {
    invokeMocha(
      ["--node-option", "fake-flag"],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, "to have failed with output", /bad option: --fake-flag/i);
        done();
      },
      "pipe",
    );
  });

  it("should work with import hooks that break find-up resolution", async function () {
    this.timeout(5000);
    const importHookPath = path.resolve(
      __dirname,
      "../fixtures/options/node-flags/import-break-find-up.mjs",
    );
    const importHookSpecifier = pathToFileURL(importHookPath).href;
    const result = await runMochaAsync("passing.fixture.cjs", [
      "--node-option",
      `import=${importHookSpecifier}`,
    ]);

    expect(result, "to have passed test count", 2);
  });
});
