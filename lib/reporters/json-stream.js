/**
 * @typedef {import('../runner.js')} Runner
 * @typedef {import('../test.js')} Test
 */

/**
 * @module JSONStream
 */
/**
 * Module dependencies.
 */

import { Base } from "./base.js";
import { Runner } from "../runner.js";

const { constants } = Runner;
var EVENT_TEST_PASS = constants.EVENT_TEST_PASS;
var EVENT_TEST_FAIL = constants.EVENT_TEST_FAIL;
var EVENT_RUN_BEGIN = constants.EVENT_RUN_BEGIN;
var EVENT_RUN_END = constants.EVENT_RUN_END;

export class JSONStream extends Base {
  static description = "newline delimited JSON events";

  /**
   * Constructs a new `JSONStream` reporter instance.
   *
   * @public
   * @memberof Mocha.reporters
   * @extends Mocha.reporters.Base
   * @param {Runner} runner - Instance triggers reporter actions.
   * @param {Object} [options] - runner options
   */
  constructor(runner, options) {
    super(runner, options);

    var self = this;
    var total = runner.total;

    runner.once(EVENT_RUN_BEGIN, function () {
      writeEvent(["start", { total }]);
    });

    runner.on(EVENT_TEST_PASS, function (test) {
      writeEvent(["pass", clean(test)]);
    });

    runner.on(EVENT_TEST_FAIL, function (test, err) {
      test = clean(test);
      test.err = err.message;
      test.stack = err.stack || null;
      writeEvent(["fail", test]);
    });

    runner.once(EVENT_RUN_END, function () {
      writeEvent(["end", self.stats]);
    });
  }
}

/**
 * Writes Mocha event to reporter output stream.
 *
 * @private
 * @param {unknown[]} event - Mocha event to be output.
 */
function writeEvent(event) {
  process.stdout.write(JSON.stringify(event) + "\n");
}

/**
 * Returns an object literal representation of `test`
 * free of cyclic properties, etc.
 *
 * @private
 * @param {Test} test - Instance used as data source.
 * @return {Object} object containing pared-down test instance data
 */
function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    file: test.file,
    duration: test.duration,
    currentRetry: test.currentRetry(),
    speed: test.speed,
  };
}
