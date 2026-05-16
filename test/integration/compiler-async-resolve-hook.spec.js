"use strict";

var exec = require("node:child_process").exec;
var path = require("node:path");

// Regression test for the asynchronous-hook scenario in
// https://github.com/mochajs/mocha/issues/5382. Complements
// compiler-esm-only-loader.spec.js, which only exercises a `load` hook;
// here we exercise a hook that uses both `resolve` and `load`.
describe("support async resolve+load hooks", function () {
  it("loads test files that import from a virtual specifier", function (done) {
    exec(
      '"' +
        process.execPath +
        '" "' +
        path.join("bin", "mocha") +
        '" -R json --require "@test/async-resolve-hook" "test/integration/fixtures/async-resolve-hook/test.fixture.mjs"',
      { cwd: path.join(__dirname, "..", "..") },
      function (error, stdout) {
        if (error && !stdout) {
          return done(error);
        }
        var results = JSON.parse(stdout);
        expect(results, "to have property", "tests");
        expect(results.failures, "to be empty");
        var titles = results.tests.map(function (test) {
          return test.fullTitle;
        });
        expect(
          titles,
          "to contain",
          "async resolve+load hook imports from a virtual specifier resolved by the hook",
        ).and("to have length", 1);
        done();
      },
    );
  });
});
