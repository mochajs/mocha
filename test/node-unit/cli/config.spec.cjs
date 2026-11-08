"use strict";

const sinon = require("sinon");
const rewiremock = require("rewiremock/node");
const { parsers } = require("../../../lib/cli/config.cjs");

describe("cli/config", function () {
  const phonyConfigObject = { ok: true };

  afterEach(function () {
    sinon.restore();
  });

  describe("loadConfig()", function () {
    let parsers;
    let loadConfig;

    beforeEach(function () {
      const config = rewiremock.proxy(
        require.resolve("../../../lib/cli/config.cjs"),
      );
      parsers = config.parsers;
      loadConfig = config.loadConfig;
    });

    describe("when parsing succeeds", function () {
      beforeEach(function () {
        sinon.stub(parsers, "yaml").returns(phonyConfigObject);
        sinon.stub(parsers, "json").returns(phonyConfigObject);
        sinon.stub(parsers, "js").returns(phonyConfigObject);
      });

      describe('when supplied a filepath with ".cjs" extension', function () {
        const filepath = "foo.cjs";

        it("should use the JS parser", function () {
          loadConfig(filepath);
          expect(parsers.js, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".js" extension', function () {
        const filepath = "foo.js";

        it("should use the JS parser", function () {
          loadConfig(filepath);
          expect(parsers.js, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".json" extension', function () {
        const filepath = "foo.json";

        it("should use the JSON parser", function () {
          loadConfig("foo.json");
          expect(parsers.json, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".jsonc" extension', function () {
        const filepath = "foo.jsonc";

        it("should use the JSON parser", function () {
          loadConfig("foo.jsonc");
          expect(parsers.json, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".mjs" extension', function () {
        const filepath = "foo.mjs";

        it("should use the JS parser", function () {
          loadConfig(filepath);
          expect(parsers.js, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".yaml" extension', function () {
        const filepath = "foo.yaml";

        it("should use the YAML parser", function () {
          loadConfig(filepath);
          expect(parsers.yaml, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });

      describe('when supplied a filepath with ".yml" extension', function () {
        const filepath = "foo.yml";

        it("should use the YAML parser", function () {
          loadConfig(filepath);
          expect(parsers.yaml, "to have calls satisfying", [
            { args: [filepath], returned: phonyConfigObject },
          ]).and("was called once");
        });
      });
    });

    describe("when supplied a filepath with unsupported extension", function () {
      beforeEach(function () {
        sinon.stub(parsers, "json").returns(phonyConfigObject);
      });

      it("should use the JSON parser", function () {
        loadConfig("foo.bar");
        expect(parsers.json, "was called");
      });
    });

    describe("when config file parsing fails", function () {
      beforeEach(function () {
        const err = new Error();
        err.name = "goo.yaml is unparsable";
        sinon.stub(parsers, "yaml").throws(err);
      });

      it("should throw", function () {
        expect(
          () => loadConfig("goo.yaml"),
          "to throw",
          "Unable to read/parse goo.yaml: goo.yaml is unparsable",
        );
      });
    });
  });

  describe("findConfig()", function () {
    let statSync;
    let findConfig;
    let CONFIG_FILES;
    const fs = require("node:fs");
    const path = require("node:path");

    beforeEach(function () {
      statSync = sinon.stub();
      const config = rewiremock.proxy(
        require.resolve("../../../lib/cli/config.cjs"),
        (r) => ({
          "node:fs": r.by(() => ({ ...fs, statSync })),
          fs: r.by(() => ({ ...fs, statSync })),
        }),
      );
      findConfig = config.findConfig;
      CONFIG_FILES = config.CONFIG_FILES;
    });

    it("should find config file in current working directory", function () {
      const expected = path.join(process.cwd(), CONFIG_FILES[0]);
      statSync.withArgs(expected).returns({ isFile: () => true });
      expect(findConfig(), "to equal", expected);
    });

    it("should support an explicit `cwd`", function () {
      const targetDir = path.resolve("/some/path");
      const expected = path.join(targetDir, CONFIG_FILES[0]);
      statSync.withArgs(expected).returns({ isFile: () => true });
      expect(findConfig(targetDir), "to equal", expected);
    });

    it("should prioritize local config over ancestor config (issue #6395)", function () {
      const parentDir = path.resolve("/some/path");
      const childDir = path.join(parentDir, "child");
      const parentConfig = path.join(parentDir, ".mocharc.cjs");
      const childConfig = path.join(childDir, ".mocharc.js");

      statSync.callsFake((filePath) => {
        if (filePath === parentConfig || filePath === childConfig) {
          return { isFile: () => true };
        }
        return undefined;
      });

      expect(findConfig(childDir), "to equal", childConfig);
    });

    it("should search ancestor directories if no config in cwd", function () {
      const parentDir = path.resolve("/some/path");
      const childDir = path.join(parentDir, "child");
      const parentConfig = path.join(parentDir, ".mocharc.yaml");

      statSync.callsFake((filePath) => {
        if (filePath === parentConfig) {
          return { isFile: () => true };
        }
        return undefined;
      });

      expect(findConfig(childDir), "to equal", parentConfig);
    });

    it("should prioritize files in CONFIG_FILES order within the same directory", function () {
      const targetDir = path.resolve("/some/path");
      const cjsConfig = path.join(targetDir, ".mocharc.cjs");
      const jsConfig = path.join(targetDir, ".mocharc.js");

      statSync.callsFake((filePath) => {
        if (filePath === cjsConfig || filePath === jsConfig) {
          return { isFile: () => true };
        }
        return undefined;
      });

      expect(findConfig(targetDir), "to equal", cjsConfig);
    });

    it("should ignore directories with matching names", function () {
      const targetDir = path.resolve("/some/path");
      const dirConfig = path.join(targetDir, CONFIG_FILES[0]);
      const fileConfig = path.join(targetDir, CONFIG_FILES[1]);

      statSync.callsFake((filePath) => {
        if (filePath === dirConfig) {
          return { isFile: () => false };
        }
        if (filePath === fileConfig) {
          return { isFile: () => true };
        }
        return undefined;
      });

      expect(findConfig(targetDir), "to equal", fileConfig);
    });

    it("should return undefined if no item is found", function () {
      statSync.returns(undefined);
      expect(findConfig("/some/path"), "to be undefined");
    });
  });

  describe("parsers()", function () {
    it("should print error message for faulty require", function () {
      // Fixture exists, but fails loading.
      // Prints correct error message without using fallback path.
      expect(
        () => parsers.js(require.resolve("./fixtures/bad-require.fixture.cjs")),
        "to throw",
        { message: /Cannot find module 'fake'/, code: "MODULE_NOT_FOUND" },
      );
    });

    it("should print error message for non-existing file", function () {
      expect(() => parsers.js("not-existing.js"), "to throw", {
        message: /Cannot find module 'not-existing.js'/,
        code: "MODULE_NOT_FOUND",
      });
    });
  });
});
