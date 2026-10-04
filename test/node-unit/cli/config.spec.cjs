"use strict";

const sinon = require("sinon");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
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
      const rewiremock = require("rewiremock/node");
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
    let tmpDir;
    let findConfig;
    let CONFIG_FILES;

    beforeEach(function () {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-config-test-"));
      const config = require("../../../lib/cli/config.cjs");
      findConfig = config.findConfig;
      CONFIG_FILES = config.CONFIG_FILES;
    });

    afterEach(function () {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("should find a config file in the given directory", function () {
      fs.writeFileSync(path.join(tmpDir, ".mocharc.js"), "");
      const result = findConfig(tmpDir);
      expect(result, "to equal", path.join(tmpDir, ".mocharc.js"));
    });

    it("should respect filename priority order within the same directory", function () {
      fs.writeFileSync(path.join(tmpDir, ".mocharc.cjs"), "");
      fs.writeFileSync(path.join(tmpDir, ".mocharc.js"), "");
      const result = findConfig(tmpDir);
      expect(result, "to equal", path.join(tmpDir, ".mocharc.cjs"));
    });

    it("should find a config in a parent directory", function () {
      const child = path.join(tmpDir, "child");
      fs.mkdirSync(child);
      fs.writeFileSync(path.join(tmpDir, ".mocharc.yaml"), "");
      const result = findConfig(child);
      expect(result, "to equal", path.join(tmpDir, ".mocharc.yaml"));
    });

    it("should prefer a local config over a parent config with higher filename priority", function () {
      const child = path.join(tmpDir, "child");
      fs.mkdirSync(child);
      fs.writeFileSync(path.join(tmpDir, ".mocharc.cjs"), "");
      fs.writeFileSync(path.join(child, ".mocharc.js"), "");
      const result = findConfig(child);
      expect(result, "to equal", path.join(child, ".mocharc.js"));
    });

    it("should return undefined if no config is found", function () {
      const empty = path.join(tmpDir, "empty");
      fs.mkdirSync(empty);
      const result = findConfig(empty);
      expect(result, "to be undefined");
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
