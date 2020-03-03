'use strict';
/**
 * @module Buffered
 */
/**
 * Module dependencies.
 */

const {
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING
} = require('../runner').constants;

/**
 * Creates a {@link BufferedEvent} from a {@link Suite}.
 * @param {string} evt - Event name
 * @param {Suite} suite - Suite object
 * @returns {BufferedEvent}
 */
const serializeSuite = (evt, suite) => ({
  name: evt,
  data: {root: suite.root, title: suite.title}
});

/**
 * Creates a {@link BufferedEvent} from a {@link Test}.
 * @param {string} evt - Event name
 * @param {Test} test - Test object
 * @param {any} err - Error, if applicable
 */
const serializeTest = (evt, test, [err]) => {
  const obj = {
    title: test.title,
    duration: test.duration,
    err: test.err,
    __fullTitle: test.fullTitle(),
    __slow: test.slow(),
    __titlePath: test.titlePath()
  };
  if (err) {
    obj.err =
      test.err && err instanceof Error
        ? {
            multiple: [...(test.err.multiple || []), err]
          }
        : err;
  }
  return {
    name: evt,
    data: obj
  };
};

/**
 * The `Buffered` reporter is for use by parallel runs.  Instead of outputting
 * to `STDOUT`, etc., it retains a list of events it receives and hands these
 * off to the callback passed into {@link Mocha#run}.  That callback will then
 * return the data to the main process.
 */
class Buffered {
  /**
   * Listens for {@link Runner} events and retains them in an `events` instance prop.
   * @param {Runner} runner
   */
  constructor(runner) {
    /**
     * Retained list of events emitted from the {@link Runner} instance.
     * @type {BufferedEvent[]}
     */
    const events = (this.events = []);

    runner
      .on(EVENT_SUITE_BEGIN, suite => {
        events.push(serializeSuite(EVENT_SUITE_BEGIN, suite));
      })
      .on(EVENT_SUITE_END, suite => {
        events.push(serializeSuite(EVENT_SUITE_END, suite));
      })
      .on(EVENT_TEST_PENDING, test => {
        events.push(serializeTest(EVENT_TEST_PENDING, test));
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        events.push(serializeTest(EVENT_TEST_FAIL, test, err));
      })
      .on(EVENT_TEST_PASS, test => {
        events.push(serializeTest(EVENT_TEST_PASS, test));
      });
  }

  /**
   * Calls the {@link Mocha#run} callback (`callback`) with the test failure
   * count and the array of {@link BufferedEvent} objects. Resets the array.
   * @param {number} failures - Number of failed tests
   * @param {Function} callback - The callback passed to {@link Mocha#run}.
   */
  done(failures, callback) {
    callback(failures, [...this.events]);
    this.events = [];
  }
}

/**
 * Serializable event data from a `Runner`.  Keys of the `data` property
 * beginning with `__` will be converted into a function which returns the value
 * upon deserialization.
 * @typedef {Object} BufferedEvent
 * @property {string} name - Event name
 * @property {object} data - Event parameters
 */

module.exports = Buffered;
