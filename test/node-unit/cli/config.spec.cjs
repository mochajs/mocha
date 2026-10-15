"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const sinon = require("sinon");
const rewiremock = require("rewiremock/node");
const {
  parsers,
  findConfig: findConfigOnDisk,
} = require("../../../lib/cli/config.cjs");

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
      const cwd = path.resolve(process.cwd());
      findup.onFirstCall().returns("/some/path/.mocharc.js");
      findConfig();
      expect(findup, "to have a call satisfying", {
        args: [CONFIG_FILES[0], { cwd, stopAt: cwd }],
        returned: "/some/path/.mocharc.js",
      });
    });

    it("should support an explicit `cwd`", function () {
      const cwd = path.resolve("/some/path/");
      findup.onFirstCall().returns("/some/path/.mocharc.js");
      findConfig("/some/path/");
      expect(findup, "to have a call satisfying", {
        args: [CONFIG_FILES[0], { cwd, stopAt: cwd }],
        returned: "/some/path/.mocharc.js",
      });
    });

    it("should try every config filename in a directory before walking up", function () {
      const start = path.resolve("/some/path/");
      const parent = path.dirname(start);
      findup.callsFake((file, options) => {
        if (options.cwd === parent && file === CONFIG_FILES[0]) {
          return path.join(parent, file);
        }
        return undefined;
      });

      expect(
        findConfig("/some/path/"),
        "to equal",
        path.join(parent, CONFIG_FILES[0]),
      );
      expect(
        findup.getCalls().slice(0, CONFIG_FILES.length),
        "to satisfy",
        CONFIG_FILES.map((file) => ({
          args: [file, { cwd: start, stopAt: start }],
        })),
      );
      expect(findup.getCall(CONFIG_FILES.length).args, "to satisfy", [
        CONFIG_FILES[0],
        { cwd: parent, stopAt: parent },
      ]);
    });

    it("should not make extra calls once an item is found", function () {
      const cwd = path.resolve("/some/path/");
      const expected = path.join(cwd, ".mocharc.mjs");
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
        { args: [CONFIG_FILES[0], { cwd, stopAt: cwd }] },
        { args: [CONFIG_FILES[1], { cwd, stopAt: cwd }] },
        { args: [CONFIG_FILES[2], { cwd, stopAt: cwd }] },
      ]);
    });

    it("should return undefined if no item is found", function () {
      findup.returns(undefined);
      expect(findConfig("/some/path/"), "to be undefined");
    });
  });

  describe("findConfig() on disk", function () {
    let tempRoot;

    beforeEach(function () {
      tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-find-config-"));
    });

    afterEach(function () {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    });

    it("should prefer a local .mocharc.js over an ancestor .mocharc.cjs", function () {
      const child = path.join(tempRoot, "child");
      fs.mkdirSync(child);
      fs.writeFileSync(
        path.join(tempRoot, ".mocharc.cjs"),
        "module.exports = { grep: 'from-parent' };\n",
      );
      fs.writeFileSync(
        path.join(child, ".mocharc.js"),
        "module.exports = { grep: 'from-child' };\n",
      );

      expect(
        findConfigOnDisk(child),
        "to equal",
        path.join(child, ".mocharc.js"),
      );
    });

    it("should use an ancestor config when the directory has none", function () {
      const child = path.join(tempRoot, "child");
      fs.mkdirSync(child);
      fs.writeFileSync(
        path.join(tempRoot, ".mocharc.cjs"),
        "module.exports = { grep: 'from-parent' };\n",
      );

      expect(
        findConfigOnDisk(child),
        "to equal",
        path.join(tempRoot, ".mocharc.cjs"),
      );
    });

    it("should prefer .mocharc.cjs over .mocharc.js in the same directory", function () {
      fs.writeFileSync(
        path.join(tempRoot, ".mocharc.cjs"),
        "module.exports = { grep: 'from-cjs' };\n",
      );
      fs.writeFileSync(
        path.join(tempRoot, ".mocharc.js"),
        "module.exports = { grep: 'from-js' };\n",
      );

      expect(
        findConfigOnDisk(tempRoot),
        "to equal",
        path.join(tempRoot, ".mocharc.cjs"),
      );
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
