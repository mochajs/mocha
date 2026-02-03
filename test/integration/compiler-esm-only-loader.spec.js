"use strict";

var exec = require("node:child_process").exec;
var path = require("node:path");

// Regression test for https://github.com/mochajs/mocha/issues/5380
describe("support ESM only module loader packages", function () {
  /**
   * Load the filename using an ESM-only loader and expect things to work
   * @param {string} filename Name of the file to load
   * @param {Function} done A Mocha done callback for when the test ends
   */
  function loadAndExpect(filename, done) {
    exec(
      '"' +
        process.execPath +
        '" "' +
        path.join("bin", "mocha") +
        `" -R json --require "@test/esm-only-loader" "${filename}"`,
      { cwd: path.join(__dirname, "..", "..") },
      function (error, stdout) {
        if (error && !stdout) {
          return done(error);
        }
        var results = JSON.parse(stdout);
        expect(results, "to have property", "tests");
        var titles = [];
        for (var index = 0; index < results.tests.length; index += 1) {
          expect(results.tests[index], "to have property", "fullTitle");
          titles.push(results.tests[index].fullTitle);
        }
        expect(titles, "to contain", "esm written in esm should work")
          .and(
            "to contain",
            "esm written in esm with top-level-await should work",
          )
          .and("to have length", 2);
        done();
      },
    );
  }

  it("should support ESM .js extension", function (done) {
    loadAndExpect("test/compiler-esm/*.js", done);
  });

  it("should support ESM .ts extension", function (done) {
    loadAndExpect("test/compiler-esm/*.ts", done);
  });

  it("should support ESM .mjs extension", function (done) {
    loadAndExpect("test/compiler-esm/*.mjs", done);
  });
});
