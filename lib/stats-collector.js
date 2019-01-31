'use strict';

/**
 * Provides a factory function for a {@link StatsCollector} object.
 * @private
 * @module
 */

/**
 * Test statistics collector.
 *
 * @private
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

var Date = global.Date;

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
  var stats = {
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

  runner.once('start', function() {
    stats.start = new Date();
  });

  runner.on('suite', function(suite) {
    suite.root || stats.suites++;
  });

  runner.on('pass', function() {
    stats.passes++;
  });

  runner.on('fail', function() {
    stats.failures++;
  });

  runner.on('pending', function() {
    stats.pending++;
  });

  runner.on('test end', function() {
    stats.tests++;
  });

  runner.once('end', function() {
    stats.end = new Date();
    stats.duration = stats.end - stats.start;
  });
}

module.exports = createStatsCollector;
