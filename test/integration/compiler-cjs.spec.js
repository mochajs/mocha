"use strict";

var exec = require("node:child_process").exec;
var path = require("node:path");

describe("support CJS require.extension compilers with esm syntax", function () {
  it("should support .js extension", function (done) {
    exec(
      '"' +
        process.execPath +
        '" "' +
        path.join("bin", "mocha") +
        '" -R json --require test/compiler-fixtures/js.fixture "test/compiler-cjs/*.js"',
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
        expect(titles, "to contain", "cjs written in esm should work").and(
          "to have length",
          1,
        );
        done();
      },
    );
  });

  it("should support .ts extension", function (done) {
    exec(
      '"' +
        process.execPath +
        '" "' +
        path.join("bin", "mocha") +
        '" -R json --require test/compiler-fixtures/ts.fixture "test/compiler-cjs/*.ts"',
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
        expect(titles, "to contain", "cts written in esm should work").and(
          "to have length",
          1,
        );
        done();
      },
    );
  });
});
