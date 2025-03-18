'use strict';

/**
 * Provides a factory function for a {@link StatsCollector} object.
 * @module
 */

const constants = require('./runner').constants;
const EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
const EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
const EVENT_SUITE_BEGIN = constants.EVENT_SUITE_BEGIN;
const EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
const EVENT_TEST_PENDING = constants.EVENT_TEST_PENDING;
const EVENT_RUN_END = constants.EVENT_RUN_END;
const EVENT_TEST_END = constants.EVENT_TEST_END;

/**
 * Test statistics collector.
 *
 * @public
 * @typedef {Object} StatsCollector
 * @property {number} suites - integer count of suites run.
 * @property {number} tests - integer count of tests run.
 * @property {number} passes - integer count of passing tests.
 * @property {number} pending - integer count of pending tests.
 * @property {number} failures - integer count of failed tests.
 * @property {Date} start - time when testing began.
 * @property {Date} end - time when testing concluded.
 * @property {number} duration - number of msecs that testing took.
 */

const Date = global.Date;

/**
 * Provides stats such as test duration, number of tests passed / failed etc., by listening for events emitted by `runner`.
 *
 * @private
 * @param {Runner} runner - Runner instance
 * @throws {TypeError} If falsy `runner`
 */
function createStatsCollector(runner) {
  /**
   * @type StatsCollector
   */
  const stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0
  };

  if (!runner) {
    throw new TypeError('Missing runner argument');
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

module.exports = createStatsCollector;
