"use strict";

const path = require("node:path");
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
    let findup;
    let findConfig;
    let CONFIG_FILES;

    beforeEach(function () {
      findup = sinon.stub();
      const config = rewiremock.proxy(
        require.resolve("../../../lib/cli/config.cjs"),
        (r) => ({
          "find-up-simple": r.by(() => ({ findUpSync: findup })),
        }),
      );
      findConfig = config.findConfig;
      CONFIG_FILES = config.CONFIG_FILES;
    });

    it("should look for one of the config files using findup-sync", function () {
      findup.onFirstCall().returns("/some/path/.mocharc.js");
      findConfig();
      expect(findup, "to have a call satisfying", {
        args: [CONFIG_FILES[0], { cwd: process.cwd(), stopAt: process.cwd() }],
        returned: "/some/path/.mocharc.js",
      });
    });

    it("should support an explicit `cwd`", function () {
      findup.onFirstCall().returns("/some/path/.mocharc.js");
      findConfig("/some/path/");
      expect(findup, "to have a call satisfying", {
        args: [CONFIG_FILES[0], { cwd: "/some/path", stopAt: "/some/path" }],
        returned: "/some/path/.mocharc.js",
      });
    });

    it("should check all config filenames in a directory before walking up", function () {
      findup.returns(undefined);
      findConfig("/some/path");
      expect(
        findup.getCalls().slice(0, CONFIG_FILES.length),
        "to satisfy",
        CONFIG_FILES.map((file) => ({
          args: [file, { cwd: "/some/path", stopAt: "/some/path" }],
        })),
      );
      expect(findup.getCall(CONFIG_FILES.length).args, "to satisfy", [
        CONFIG_FILES[0],
        { cwd: "/some", stopAt: "/some" },
      ]);
    });

    it("should prefer a local config file over a higher-priority filename in a parent directory", function () {
      const existing = new Set([
        "/some/.mocharc.cjs",
        "/some/path/.mocharc.js",
      ]);
      // Simulate find-up-simple: search `stopAt` and below for `file`
      findup.callsFake((file, options) => {
        let directory = path.resolve(options.cwd);
        const stopAt = path.resolve(
          options.stopAt ?? path.parse(directory).root,
        );
        for (;;) {
          const filepath = path.join(directory, file);
          if (existing.has(filepath)) {
            return filepath;
          }
          if (
            directory === stopAt ||
            directory === path.parse(directory).root
          ) {
            return undefined;
          }
          directory = path.dirname(directory);
        }
      });

      expect(findConfig("/some/path"), "to equal", "/some/path/.mocharc.js");
    });

    it("should not make extra calls once an item is found", function () {
      const expected = "/some/path/.mocharc.mjs";
      findup
        .onFirstCall()
        .returns(undefined)
        .onSecondCall()
        .returns(undefined)
        .onThirdCall()
        .returns(expected);

      expect(findConfig("/some/path/"), "to equal", expected);
      expect(findup, "was called times", 3);
      expect(findup.getCalls(), "to satisfy", [
        {
          args: [CONFIG_FILES[0], { cwd: "/some/path", stopAt: "/some/path" }],
        },
        {
          args: [CONFIG_FILES[1], { cwd: "/some/path", stopAt: "/some/path" }],
        },
        {
          args: [CONFIG_FILES[2], { cwd: "/some/path", stopAt: "/some/path" }],
        },
      ]);
    });

    it("should return undefined if no item is found", function () {
      findup.returns(undefined);
      expect(findConfig("/some/path/"), "to be undefined");
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
