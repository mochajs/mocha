"use strict";

const fs = require("node:fs");
const path = require("node:path");

/**
 * Delays v8.takeCoverage() in worker processes so a 1s terminate timeout
 * would kill the worker before the flush finishes.
 */
if (process.env.MOCHA_WORKER_ID !== undefined && process.env.NODE_V8_COVERAGE) {
  const v8 = require("node:v8");
  const takeCoverage = v8.takeCoverage.bind(v8);
  v8.takeCoverage = function delayedTakeCoverage() {
    return new Promise((resolve) => {
      setTimeout(() => {
        takeCoverage();
        fs.writeFileSync(
          path.join(
            process.env.NODE_V8_COVERAGE,
            `mocha-worker-flush-${process.pid}.ok`,
          ),
          "",
        );
        resolve();
      }, 2000);
    });
  };
}
