"use strict";

var invokeMochaAsync = require("../helpers").invokeMochaAsync;
const semver = require("semver");

/**
 * Extracts root hook log messages from run results
 * `root-hook-defs-*` fixtures are root hook plugins which call `console.log()`
 * for verification that they have been run.
 * @param {RawResult} res - result of invokeMochaAsync()
 */
function extractHookOutputFromResult(res) {
  return res.output
    .trim()
    .split("\n")
    .filter(function (line) {
      // every line that begins with whitespace (e.g., the test name) should be ignored;
      // we just want the console.log messages
      return /^\S/.test(line);
    })
    .sort();
}

/**
 * Helper to call Mocha and pipe the result through `extractHookOutputFromResult`
 * @param {*} args - args for invokeMochaAsync
 * @param {*} opts - opts for invokeMochaAsync
 */
function runMochaForHookOutput(args, opts) {
  return invokeMochaAsync(args, opts)[1].then(extractHookOutputFromResult);
}

describe("root hooks", function () {
  describe("when mocha run in serial mode", function () {
    it("should run root hooks when provided via mochaHooks object export", function () {
      return expect(
        runMochaForHookOutput([
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js",
            ),
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js",
            ),
          require.resolve(
            "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
          ),
        ]),
        "to be fulfilled with",
        [
          "afterAll",
          "afterAll array 1",
          "afterAll array 2",
          "afterEach",
          "afterEach array 1",
          "afterEach array 2",
          "beforeAll",
          "beforeAll array 1",
          "beforeAll array 2",
          "beforeEach",
          "beforeEach array 1",
          "beforeEach array 2",
        ],
      );
    });

    it("should run root hooks when provided via mochaHooks function export", function () {
      return expect(
        runMochaForHookOutput([
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-c.fixture.js",
            ),
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-d.fixture.js",
            ),
          require.resolve(
            "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
          ),
        ]),
        "to be fulfilled with",
        [
          "afterAll",
          "afterAll array 1",
          "afterAll array 2",
          "afterEach",
          "afterEach array 1",
          "afterEach array 2",
          "beforeAll",
          "beforeAll array 1",
          "beforeAll array 2",
          "beforeEach",
          "beforeEach array 1",
          "beforeEach array 2",
        ],
      );
    });

    describe("support ESM when type=module or .mjs extension", function () {
      it("should run root hooks when provided via mochaHooks", function () {
        return expect(
          runMochaForHookOutput([
            "--require=" +
              require.resolve(
                // as object
                "../fixtures/plugins/root-hooks/root-hook-defs-esm.fixture.mjs",
              ),
            "--require=" +
              require.resolve(
                // as function
                "../fixtures/plugins/root-hooks/esm/root-hook-defs-esm.fixture.js",
              ),
            "--require=" +
              require.resolve(
                // mixed with commonjs
                "../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js",
              ),
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
            ),
          ]),
          "to be fulfilled with",
          [
            "afterAll",
            "afterEach",
            "beforeAll",
            "beforeEach",
            "esm afterEach",
            "esm beforeEach",
            "mjs afterAll",
            "mjs beforeAll",
          ],
        );
      });
    });

    describe("support ESM via .js extension w/o type=module", function () {
      // --(no-)experimental-detect-module was experimental when these tests were written
      // https://nodejs.org/api/cli.html#--no-experimental-detect-module
      // https://nodejs.org/api/packages.html#syntax-detection
      // (introduced in Node 20.10.0, 21.1.0)
      // newer versions of Node no longer fail :)
      function isNewerVersion(vString) {
        // Latest versions considered "older": 18.20.8, 20.18.3, 22.11.0
        // (May update after writing)
        return semver.satisfies(vString, "^20.19.0 || ^22.12.0 || ^24.0.0");
      }

      describe("on older versions, should fail due to ambiguous file type", function () {
        // --(no-)experimental-detect-module was experimental when these tests were written
        // (introduced in Node 20.10.0, 21.1.0)
        // newer versions of Node no longer fail :)
        if (isNewerVersion(process.versions.node)) {
          return true; // skip suite on newer Node versions
        }

        const filename =
          "../fixtures/plugins/root-hooks/root-hook-defs-esm-broken.fixture.js";
        const noDetectModuleRegex = /SyntaxError: Unexpected token/;
        const detectModuleRegex = /Cannot require\(\) ES Module/;

        it("with --no-experimental-detect-module", function () {
          return expect(
            invokeMochaAsync(
              [
                "--require=" + require.resolve(filename), // as object
                "--no-experimental-detect-module",
              ],
              "pipe",
            )[1],
            "when fulfilled",
            "to contain output",
            noDetectModuleRegex,
          );
        });

        it("with --experimental-detect-module", function () {
          // --experimental-detect-module was introduced in Node 20.10.0, 21.1.0
          // adding the flag to older versions of Node does nothing
          const expectedRegex =
            process.version >= "v21.1.0"
              ? detectModuleRegex
              : noDetectModuleRegex;
          return expect(
            invokeMochaAsync(
              [
                "--require=" + require.resolve(filename), // as object
                "--experimental-detect-module",
              ],
              "pipe",
            )[1],
            "when fulfilled",
            "to contain output",
            expectedRegex,
          );
        });
      });

      describe("on newer versions, should work", function () {
        if (!isNewerVersion(process.versions.node)) {
          return true; // skip suite on older Node versions
        }

        const filename =
          "../fixtures/plugins/root-hooks/root-hook-defs-esm-broken.fixture.js";
        const runSuccessRegex = /0 passing/;

        it("with --no-experimental-detect-module", function () {
          return expect(
            invokeMochaAsync(
              [
                "--require=" + require.resolve(filename), // as object
                "--no-experimental-detect-module",
              ],
              "pipe",
            )[1],
            "when fulfilled",
            "to contain output",
            runSuccessRegex,
          );
        });

        it("with --experimental-detect-module", function () {
          return expect(
            invokeMochaAsync(
              [
                "--require=" + require.resolve(filename), // as object
                // enabled by default in these newer versions, but clearer to use it explicitly
                "--experimental-detect-module",
              ],
              "pipe",
            )[1],
            "when fulfilled",
            "to contain output",
            runSuccessRegex,
          );
        });
      });
    });
  });

  describe("when mocha in parallel mode", function () {
    it("should run root hooks when provided via mochaHooks object exports", function () {
      return expect(
        runMochaForHookOutput([
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js",
            ),
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js",
            ),
          "--parallel",
          require.resolve(
            "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
          ),
        ]),
        "to be fulfilled with",
        [
          "afterAll",
          "afterAll array 1",
          "afterAll array 2",
          "afterEach",
          "afterEach array 1",
          "afterEach array 2",
          "beforeAll",
          "beforeAll array 1",
          "beforeAll array 2",
          "beforeEach",
          "beforeEach array 1",
          "beforeEach array 2",
        ],
      );
    });

    it("should run root hooks when provided via mochaHooks function export", function () {
      return expect(
        runMochaForHookOutput([
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-c.fixture.js",
            ),
          "--require=" +
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-defs-d.fixture.js",
            ),
          "--parallel",
          require.resolve(
            "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
          ),
        ]),
        "to be fulfilled with",
        [
          "afterAll",
          "afterAll array 1",
          "afterAll array 2",
          "afterEach",
          "afterEach array 1",
          "afterEach array 2",
          "beforeAll",
          "beforeAll array 1",
          "beforeAll array 2",
          "beforeEach",
          "beforeEach array 1",
          "beforeEach array 2",
        ],
      );
    });

    describe("when running multiple jobs", function () {
      it("should run root hooks when provided via mochaHooks object exports for each job", function () {
        return expect(
          runMochaForHookOutput([
            "--require=" +
              require.resolve(
                "../fixtures/plugins/root-hooks/root-hook-defs-a.fixture.js",
              ),
            "--require=" +
              require.resolve(
                "../fixtures/plugins/root-hooks/root-hook-defs-b.fixture.js",
              ),
            "--parallel",
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-test.fixture.js",
            ),
            require.resolve(
              "../fixtures/plugins/root-hooks/root-hook-test-2.fixture.js",
            ),
          ]),
          "to be fulfilled with",
          [
            "afterAll",
            "afterAll",
            "afterAll array 1",
            "afterAll array 1",
            "afterAll array 2",
            "afterAll array 2",
            "afterEach",
            "afterEach",
            "afterEach array 1",
            "afterEach array 1",
            "afterEach array 2",
            "afterEach array 2",
            "beforeAll",
            "beforeAll",
            "beforeAll array 1",
            "beforeAll array 1",
            "beforeAll array 2",
            "beforeAll array 2",
            "beforeEach",
            "beforeEach",
            "beforeEach array 1",
            "beforeEach array 1",
            "beforeEach array 2",
            "beforeEach array 2",
          ],
        );
      });
    });
  });
});
