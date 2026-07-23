"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { invokeNode } = require("./helpers.cjs");

describe("package entrypoint", function () {
  it("should resolve the package root without DEP0151 warnings", async function () {
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

      const result = await new Promise((resolve, reject) => {
        invokeNode(
          [
            "--input-type=module",
            "-e",
            "import {describe, it} from 'mocha'; console.log(typeof describe, typeof it);",
          ],
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

      expect(result.code, "to be", 0);
      expect(result.output, "to contain", "function function");
      expect(result.output, "not to contain", "DEP0151");
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
