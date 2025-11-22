"use strict";

const assert = require("node:assert/strict");
const { execSync } = require("node:child_process");
const {
  createReadStream,
  createWriteStream,
  mkdtempSync,
  unlinkSync,
} = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

const { invokeMocha, toJSONResult } = require("./helpers");

describe("FIFO support", function () {
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
      { stdio: "pipe" },
    );
  });
});
