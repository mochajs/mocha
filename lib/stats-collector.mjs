/**
 * @typedef {import('./types.d.ts').StatsCollector} StatsCollector
 * @typedef {import('./runner.js')} Runner
 */

/**
 * Provides a factory function for a {@link StatsCollector} object.
 * @module
 */

import Runner from "./runner.js";

const {
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_SUITE_BEGIN,
  EVENT_RUN_BEGIN,
  EVENT_TEST_PENDING,
  EVENT_RUN_END,
  EVENT_TEST_END,
} = Runner.constants;

/**
 * Provides stats such as test duration, number of tests passed / failed etc., by listening for events emitted by `runner`.
 *
 * @private
 * @param {Runner} runner - Runner instance
 * @throws {TypeError} If falsy `runner`
 */
function createStatsCollector(runner) {
  /**
   * @type {StatsCollector}
   */
  var stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0,
  };

  if (!runner) {
    throw new TypeError("Missing runner argument");
  }

  runner.stats = stats;

  runner.once(EVENT_RUN_BEGIN, function () {
    stats.start = new Date();
  });
  runner.on(EVENT_SUITE_BEGIN, function (suite) {
    suite.root || stats.suites++;
  });
  runner.on(EVENT_TEST_PASS, function () {
    stats.passes++;
  });
  runner.on(EVENT_TEST_FAIL, function () {
    stats.failures++;
  });
  runner.on(EVENT_TEST_PENDING, function () {
    stats.pending++;
  });
  runner.on(EVENT_TEST_END, function () {
    stats.tests++;
  });
  runner.once(EVENT_RUN_END, function () {
    stats.end = new Date();
    stats.duration = stats.end - stats.start;
  });
}

export default createStatsCollector;
