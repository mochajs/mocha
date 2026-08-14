"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { sync: rimrafSync } = require("rimraf");
const { invokeMochaAsync, resolveFixturePath } = require("../helpers.cjs");

describe("--worker-terminate-timeout", function () {
  this.timeout(20000);

  it("should appear in --help", async function () {
    const [, promise] = invokeMochaAsync(["--help"], "pipe");
    return expect(
      promise,
      "when fulfilled",
      "to contain output",
      /--worker-terminate-timeout/,
    );
  });

  describe("when collecting V8 coverage in parallel mode", function () {
    let coverageDir;

    beforeEach(function () {
      coverageDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "mocha-worker-coverage-"),
      );
    });

    afterEach(function () {
      rimrafSync(coverageDir);
    });

    it("should let workers finish flushing coverage before they are killed", async function () {
      const [, promise] = invokeMochaAsync(
        [
          "--parallel",
          "--jobs",
          "2",
          "--require",
          resolveFixturePath(
            "options/parallel/slow-coverage-flush.fixture.cjs",
          ),
          resolveFixturePath("options/parallel/test-a.fixture.js"),
          resolveFixturePath("passing.fixture.cjs"),
        ],
        {
          env: {
            ...process.env,
            NODE_V8_COVERAGE: coverageDir,
          },
        },
      );

      await expect(promise, "when fulfilled", "to have succeeded");

      const flushed = fs
        .readdirSync(coverageDir)
        .filter((name) => name.startsWith("mocha-worker-flush-"));
      expect(flushed.length, "to be greater than", 0);
    });
  });
});
