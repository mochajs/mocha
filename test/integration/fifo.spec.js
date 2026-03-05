import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const { invokeMocha, toJSONResult } = require("./helpers");

describe("FIFO support", function () {
  it("should accept a test passed as a FIFO", function (done) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mocha-test-fifo-"));
    const fifoPath = path.join(dir, "fifo-1");
    execSync(`mkfifo ${fifoPath}`);

    const writer = fs.createWriteStream(fifoPath);
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
          fs.unlinkSync(fifoPath);

          done();
        } catch (err) {
          // Node hangs if FIFO is never read from.
          fs.createReadStream(fifoPath).close();

          done(err);
        }
      },
      { stdio: "pipe" },
    );
  });
});
