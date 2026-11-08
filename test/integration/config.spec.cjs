"use strict";

// This is not a "functional" test; we aren't invoking the mocha executable.
// Instead we just avoid test doubles.

var fs = require("node:fs");
var os = require("node:os");
var path = require("node:path");
var { loadConfig, findConfig } = require("../../lib/cli/config.cjs");

describe("config", function () {
  it("should return the same values for all supported config types", function () {
    var configDir = path.join(__dirname, "fixtures", "config");
    var js = loadConfig(path.join(configDir, "mocharc.js")); // canonical form, ESM
    var cjs = loadConfig(path.join(configDir, "mocharc.cjs"));
    var json = loadConfig(path.join(configDir, "mocharc.json"));
    var yaml = loadConfig(path.join(configDir, "mocharc.yaml"));
    expect(cjs, "to equal", js);
    expect(json, "to equal", js);
    expect(yaml, "to equal", js);
  });

  describe('when configuring Mocha via a ".js" file', function () {
    var projRootDir = path.join(__dirname, "..", "..");
    var configDir = path.join(__dirname, "fixtures", "config");
    var json = loadConfig(path.join(configDir, "mocharc.json"));

    it("should load configuration given absolute path", function () {
      var js;

      function _loadConfig() {
        js = loadConfig(path.join(configDir, "mocharc.js"));
      }

      expect(_loadConfig, "not to throw");
      expect(js, "to equal", json);
    });

    it("should load configuration given cwd-relative path", function () {
      var relConfigDir = configDir.substring(projRootDir.length + 1);
      var js;

      function _loadConfig() {
        js = loadConfig(path.join(".", relConfigDir, "mocharc.js"));
      }

      expect(_loadConfig, "not to throw");
      expect(js, "to equal", json);
    });

    it("should rethrow error from absolute path configuration", function () {
      function _loadConfig() {
        loadConfig(path.join(configDir, "mocharcWithThrowError.cjs"));
      }

      expect(_loadConfig, "to throw", {
        message: /Error from mocharcWithThrowError/,
      });
    });

    it("should rethrow error from cwd-relative path configuration", function () {
      var relConfigDir = configDir.substring(projRootDir.length + 1);

      function _loadConfig() {
        loadConfig(path.join(".", relConfigDir, "mocharcWithThrowError.cjs"));
      }

      expect(_loadConfig, "to throw", {
        message: /Error from mocharcWithThrowError/,
      });
    });

    // In other words, path does not begin with '/', './', or '../'
    describe("when path is neither absolute or relative", function () {
      var nodeModulesDir = path.join(projRootDir, "node_modules");
      var pkgName = "mocha-config";
      var installedLocally = false;
      var symlinkedPkg = false;
      var linkType = process.platform === "win32" ? "junction" : "dir";

      before(function () {
        try {
          var srcPath = path.join(configDir, pkgName);
          var targetPath = path.join(nodeModulesDir, pkgName);
          fs.symlinkSync(srcPath, targetPath, linkType);
          symlinkedPkg = true;
          installedLocally = true;
        } catch (err) {
          if (err.code === "EEXIST") {
            console.log("setup:", 'package already exists in "node_modules"');
            installedLocally = true;
          } else {
            console.error("setup failed:", err);
          }
        }
      });

      it("should load configuration given module-relative path", function () {
        var js;

        if (!installedLocally) {
          return this.skip();
        }

        function _loadConfig() {
          js = loadConfig(path.join(pkgName, "index.js"));
        }

        expect(_loadConfig, "not to throw");
        expect(js, "to equal", json);
      });

      after(function () {
        if (symlinkedPkg) {
          try {
            fs.unlinkSync(path.join(nodeModulesDir, pkgName));
          } catch (err) {
            console.error("teardown failed:", err);
          }
        }
      });
    });
  });

  describe("findConfig()", function () {
    var tempDir;
    var childDir;

    beforeEach(function () {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-config-test-"));
      childDir = path.join(tempDir, "child");
      fs.mkdirSync(childDir);
    });

    afterEach(function () {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it("should choose local .mocharc.js over ancestor .mocharc.cjs", function () {
      var parentConfig = path.join(tempDir, ".mocharc.cjs");
      var childConfig = path.join(childDir, ".mocharc.js");
      fs.writeFileSync(parentConfig, "module.exports = {};");
      fs.writeFileSync(childConfig, "module.exports = {};");

      expect(findConfig(childDir), "to equal", childConfig);
    });

    it("should find ancestor .mocharc.cjs when child has no config", function () {
      var parentConfig = path.join(tempDir, ".mocharc.cjs");
      fs.writeFileSync(parentConfig, "module.exports = {};");

      expect(findConfig(childDir), "to equal", parentConfig);
    });
  });
});
