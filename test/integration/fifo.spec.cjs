"use strict";

const assert = require("node:assert/strict");
const { execFile, execSync } = require("node:child_process");
const { promisify } = require("node:util");
const {
  createReadStream,
  createWriteStream,
  mkdtempSync,
  unlinkSync,
} = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const { invokeMocha, toJSONResult } = require("./helpers.cjs");
const execFileAsync = promisify(execFile);
const itPosix = process.platform === "win32" ? it.skip : it;

describe("FIFO support", function () {
  itPosix(
    "should accept a test passed using process substitution when respawning",
    async function () {
      const source = "it('should pass', () => true);";
      const mochaPath = require.resolve("../../bin/mocha.js");

      const { stdout } = await execFileAsync("/bin/bash", [
        "-c",
        '"$1" --no-config --reporter json --preserve-symlinks <(printf %s "$2")',
        "bash",
        mochaPath,
        source,
      ]);

      const result = JSON.parse(stdout);
      assert.equal(result.stats.tests, 1);
      assert.equal(result.stats.passes, 1);
    },
  );

  it("should accept a test passed as a FIFO", function (done) {
    const dir = mkdtempSync(join(tmpdir(), "mocha-test-fifo-"));
    const fifoPath = join(dir, "fifo-1");
    execSync(`mkfifo ${fifoPath}`);

    const writer = createWriteStream(fifoPath);
    writer.on("ready", () => {
      writer.write(
        `
        describe('suite from FIFO', () => {
          it('should pass', () => true);
        });
      `,
        (err) => {
          if (!err) writer.end();
        },
      );
    });

    const args = ["--reporter", "json", fifoPath];

    invokeMocha(
      args,
      (err, res) => {
        if (err) return done(err);

        try {
          const result = toJSONResult(res);
          assert.equal(result.code, 0);
          assert.equal(result.stats.suites, 1);
          assert.equal(result.stats.tests, 1);
          assert.equal(result.stats.passes, 1);
          assert.equal(result.stats.pending, 0);
          assert.equal(result.stats.failures, 0);

          // Node hangs if FIFO is never unlinked.
          unlinkSync(fifoPath);

          done();
        } catch (err) {
          // Node hangs if FIFO is never read from.
          createReadStream(fifoPath).close();

          done(err);
        }
      },
      { separateStderr: true, stdio: "pipe" },
    );
  });
});
