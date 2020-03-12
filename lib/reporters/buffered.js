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
  EVENT_TEST_PENDING,
  EVENT_TEST_BEGIN,
  EVENT_TEST_END,
  EVENT_TEST_RETRY,
  EVENT_DELAY_BEGIN,
  EVENT_DELAY_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END,
  EVENT_RUN_END
} = require('../runner').constants;
const {SerializableEvent, SerializableWorkerResult} = require('../serializer');
// const debug = require('debug')('mocha:reporters:buffered');
const Base = require('./base');

/**
 * The `Buffered` reporter is for use by parallel runs.  Instead of outputting
 * to `STDOUT`, etc., it retains a list of events it receives and hands these
 * off to the callback passed into {@link Mocha#run}.  That callback will then
 * return the data to the main process.
 */
class Buffered extends Base {
  /**
   * Listens for {@link Runner} events and retains them in an `events` instance prop.
   * @param {Runner} runner
   */
  constructor(runner, opts) {
    super(runner, opts);

    /**
     * Retained list of events emitted from the {@link Runner} instance.
     * @type {BufferedEvent[]}
     * @memberOf Buffered
     */
    const events = (this.events = []);

    const listeners = new Map();
    const createListener = evt => {
      const listener = (runnable, err) => {
        events.push(SerializableEvent.create(evt, runnable, err));
      };
      listeners.set(evt, listener);
      return listener;
    };

    [
      EVENT_DELAY_BEGIN,
      EVENT_SUITE_BEGIN,
      EVENT_SUITE_END,
      EVENT_TEST_BEGIN,
      EVENT_TEST_PENDING,
      EVENT_TEST_FAIL,
      EVENT_TEST_PASS,
      EVENT_TEST_RETRY,
      EVENT_TEST_END,
      EVENT_DELAY_END,
      EVENT_HOOK_BEGIN,
      EVENT_HOOK_END
    ].forEach(evt => {
      runner.on(evt, createListener(evt));
    });

    runner.once(EVENT_RUN_END, () => {
      listeners.forEach((listener, evt) => {
        runner.removeListener(evt, listener);
      });
      listeners.clear();
    });
  }

  /**
   * Calls the {@link Mocha#run} callback (`callback`) with the test failure
   * count and the array of {@link BufferedEvent} objects. Resets the array.
   * @param {number} failures - Number of failed tests
   * @param {Function} callback - The callback passed to {@link Mocha#run}.
   */
  done(failures, callback) {
    callback(SerializableWorkerResult.create(failures, this.events));
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
