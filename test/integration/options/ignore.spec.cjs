"use strict";

var fs = require("node:fs");
var os = require("node:os");
var path = require("node:path").posix;
var helpers = require("../helpers.cjs");
var runMochaJSON = helpers.runMochaJSON;
var resolvePath = helpers.resolveFixturePath;

describe("--ignore", function () {
  /*
   * Runs mocha in {path} with the given args.
   * Calls handleResult with the result.
   *
   * @param {string} fixture
   * @param {string[]} args
   * @param {function} handleResult
   * @param {function} done
   */
  function runMochaTest(fixture, args, handleResult, done) {
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      handleResult(res);
      done();
    });
  }

  it("should ignore specific files", function (done) {
    var fixtures = path.join("options", "ignore", "*.fixture.js");
    runMochaTest(
      fixtures,
      [
        "--ignore",
        resolvePath(path.join("options", "ignore", "fail.fixture.js")).replace(
          /\\/g,
          "/",
        ),
      ],
      function (res) {
        expect(res, "to have passed")
          .and("to have run test", "should find this test")
          .and("not to have pending tests");
      },
      done,
    );
  });

  it("should ignore globbed files", function (done) {
    var fixtures = path.join("options", "ignore", "**", "*.fixture.js");
    runMochaTest(
      fixtures,
      ["--ignore", "**/fail.fixture.js"],
      function (res) {
        expect(res, "to have passed")
          .and("not to have pending tests")
          .and("to have passed test count", 2);
      },
      done,
    );
  });

  describe("by default", function () {
    var tmpdir;

    var passingFixture = [
      "'use strict';",
      "describe('ignore default pass', function () {",
      "  it('should find this test', function () {});",
      "});",
      "",
    ].join("\n");

    var failingFixture = [
      "'use strict';",
      "describe('ignore default fail', function () {",
      "  it('should not run this test', function () {",
      "    throw new Error('should not run');",
      "  });",
      "});",
      "",
    ].join("\n");

    before(function () {
      tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-ignore-"));
      fs.writeFileSync(path.join(tmpdir, "pass.fixture.js"), passingFixture);
      [
        path.join("node_modules", "dep"),
        path.join("nested", "node_modules", "dep"),
        ".git",
      ].forEach(function (dir) {
        fs.mkdirSync(path.join(tmpdir, dir), { recursive: true });
        fs.writeFileSync(
          path.join(tmpdir, dir, "fail.fixture.js"),
          failingFixture,
        );
      });
    });

    after(function () {
      fs.rmSync(tmpdir, { recursive: true, force: true });
    });

    it("should ignore files in node_modules and .git directories", function (done) {
      runMochaTest(
        tmpdir,
        ["--recursive"],
        function (res) {
          expect(res, "to have passed")
            .and("to have passed test count", 1)
            .and("not to have pending tests");
        },
        done,
      );
    });
  });

  it("should ignore multiple patterns", function (done) {
    var fixtures = path.join("options", "ignore", "**", "*.fixture.js");
    runMochaTest(
      fixtures,
      [
        "--ignore",
        resolvePath(path.join("options", "ignore", "fail.fixture.js")).replace(
          /\\/g,
          "/",
        ),
        "--ignore",
        resolvePath(
          path.join("options", "ignore", "nested", "fail.fixture.js"),
        ).replace(/\\/g, "/"),
      ],
      function (res) {
        expect(res, "to have passed")
          .and("not to have pending tests")
          .and("to have passed test count", 2);
      },
      done,
    );
  });
});
