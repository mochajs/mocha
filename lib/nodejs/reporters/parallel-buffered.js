/**
 * "Buffered" reporter used internally by a worker process when running in parallel mode.
 * @module reporters/parallel-buffered
 * @private
 */

'use strict';

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
} = require('../../runner').constants;
const {SerializableEvent, SerializableWorkerResult} = require('../serializer');
const debug = require('debug')('mocha:reporters:buffered');
const Base = require('../../reporters/base');

/**
 * List of events to listen to; these will be buffered and sent
 * when `Mocha#run` is complete (via {@link ParallelBuffered#done}).
 */
const EVENT_NAMES = [
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END,
  EVENT_TEST_BEGIN,
  EVENT_TEST_PENDING,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_RETRY,
  EVENT_TEST_END,
  EVENT_HOOK_BEGIN,
  EVENT_HOOK_END
];

/**
 * Like {@link EVENT_NAMES}, except we expect these events to only be emitted
 * by the `Runner` once.
 */
const ONCE_EVENT_NAMES = [EVENT_DELAY_BEGIN, EVENT_DELAY_END];

/**
 * The `ParallelBuffered` reporter is for use by concurrent runs. Instead of outputting
 * to `STDOUT`, etc., it retains a list of events it receives and hands these
 * off to the callback passed into {@link Mocha#run}. That callback will then
 * return the data to the main process.
 * @private
 */
class ParallelBuffered extends Base {
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

    /**
     * mapping of event names to listener functions we've created,
     * so we can cleanly _remove_ them from the runner once it's completed.
     */
    const listeners = new Map();

    /**
     * Creates a listener for event `eventName` and adds it to the `listeners`
     * map. This is a defensive measure, so that we don't a) leak memory or b)
     * remove _other_ listeners that may not be associated with this reporter.
     * @param {string} eventName - Event name
     */
    const createListener = eventName =>
      listeners
        .set(eventName, (runnable, err) => {
          events.push(SerializableEvent.create(eventName, runnable, err));
        })
        .get(eventName);

    EVENT_NAMES.forEach(evt => {
      runner.on(evt, createListener(evt));
    });
    ONCE_EVENT_NAMES.forEach(evt => {
      runner.once(evt, createListener(evt));
    });

    runner.once(EVENT_RUN_END, () => {
      debug('received EVENT_RUN_END');
      listeners.forEach((listener, evt) => {
        runner.removeListener(evt, listener);
        listeners.delete(evt);
      });
    });
  }

  /**
   * Calls the {@link Mocha#run} callback (`callback`) with the test failure
   * count and the array of {@link BufferedEvent} objects. Resets the array.
   * @param {number} failures - Number of failed tests
   * @param {Function} callback - The callback passed to {@link Mocha#run}.
   */
  done(failures, callback) {
    callback(SerializableWorkerResult.create(this.events, failures));
    this.events = []; // defensive
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

module.exports = ParallelBuffered;
