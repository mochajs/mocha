"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { invokeNode } = require("./helpers.cjs");

async function invokeNodeWithLinkedMocha(args) {
  const repoRoot = path.resolve(__dirname, "..", "..");
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

  it("should resolve deep subpaths without a file extension", async function () {
    const result = await invokeNodeWithLinkedMocha([
      "-e",
      "require.resolve('mocha/lib/reporters/base');" +
        "require.resolve('mocha/lib/stats-collector');" +
        "console.log('resolved deep subpaths');",
    ]);

    expect(result.code, "to be", 0);
    expect(result.output, "to contain", "resolved deep subpaths");
  });

  it("should resolve deep subpaths with a file extension", async function () {
    const result = await invokeNodeWithLinkedMocha([
      "-e",
      "require.resolve('mocha/lib/reporters/base.js');" +
        "require.resolve('mocha/lib/stats-collector.js');" +
        "console.log('resolved deep subpaths');",
    ]);

    expect(result.code, "to be", 0);
    expect(result.output, "to contain", "resolved deep subpaths");
  });
});
