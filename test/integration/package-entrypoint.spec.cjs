"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { invokeNode } = require("./helpers.cjs");
const repoRoot = path.resolve(__dirname, "..", "..");
const { exports: exportsMap } = require("../../package.json");

async function invokeNodeWithLinkedMocha(args) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-package-root-"));
  const packageDir = path.join(tempDir, "node_modules", "mocha");

  fs.mkdirSync(path.dirname(packageDir), { recursive: true });

  try {
    if (process.platform === "win32") {
      fs.symlinkSync(repoRoot, packageDir, "junction");
    } else {
      fs.symlinkSync(repoRoot, packageDir);
    }

    return await new Promise((resolve, reject) => {
      invokeNode(
        args,
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(res);
        },
        { cwd: tempDir, stdio: ["ignore", "pipe", "pipe"] },
      );
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function resolveSpecifiers(specifiers) {
  return invokeNodeWithLinkedMocha([
    "-e",
    `const failed = ${JSON.stringify(specifiers)}.filter((specifier) => {
      try {
        require.resolve(specifier);
        return false;
      } catch {
        return true;
      }
    });
    console.log(failed.length ? "FAILED: " + failed.join(", ") : "ALL RESOLVED");`,
  ]);
}

describe("package entrypoint", function () {
  it("should resolve the package root without DEP0151 warnings", async function () {
    const result = await invokeNodeWithLinkedMocha([
      "--input-type=module",
      "-e",
      "import {describe, it} from 'mocha'; console.log(typeof describe, typeof it);",
    ]);

    expect(result.code, "to be", 0);
    expect(result.output, "to contain", "function function");
    expect(result.output, "not to contain", "DEP0151");
  });

  it("should point every declared export at a file that exists", function () {
    const missing = Object.values(exportsMap).filter(
      (target) => !fs.existsSync(path.join(repoRoot, target)),
    );

    expect(missing, "to equal", []);
  });

  it("should resolve every declared export", async function () {
    const result = await resolveSpecifiers(
      Object.keys(exportsMap).map((subpath) =>
        subpath === "." ? "mocha" : subpath.replace("./", "mocha/"),
      ),
    );

    expect(result.output, "to contain", "ALL RESOLVED");
    expect(result.code, "to be", 0);
  });

  it("should resolve legacy subpaths that Mocha 11 supported", async function () {
    const result = await resolveSpecifiers([
      // extensionless, most common spelling
      "mocha/lib/reporters/base",
      "mocha/lib/stats-collector",
      "mocha/lib/utils",

      // mocha 11 spellings of files that 12 renamed to .cjs
      "mocha/lib/utils.js",
      "mocha/lib/runner.js",
      "mocha/lib/cli/options.js",

      // documented in explainers/third-party-uis
      "mocha/lib/interfaces/common.js",

      // directory spellings that used to work via legacy index resolution
      "mocha/lib/cli",
      "mocha/lib/interfaces",
      "mocha/lib/reporters",

      // browser assets
      "mocha/mocha.js",
      "mocha/mocha.css",
    ]);

    expect(result.output, "to contain", "ALL RESOLVED");
    expect(result.code, "to be", 0);
  });

  it("should keep non-exported paths private", async function () {
    const result = await resolveSpecifiers([
      // removed in 12, must stay removed
      "mocha/bin/_mocha",

      // never published and not part of the package's API
      "mocha/test/unit/mocha.spec.cjs",
      "mocha/rollup.config.js",
    ]);

    expect(result.output, "to contain", "FAILED: mocha/bin/_mocha");
    expect(result.output, "to contain", "mocha/test/unit/mocha.spec.cjs");
    expect(result.output, "to contain", "mocha/rollup.config.js");
  });
});
