'use strict';

const Runner = require('./runner');
const {EVENT_RUN_BEGIN, EVENT_RUN_END} = Runner.constants;
const {spawn, Pool, Worker} = require('threads');
const debug = require('debug')('mocha:buffered-runner');

/**
 * This `Runner` delegates tests runs to worker threads.  Does not execute any
 * {@link Runnable}s by itself!
 */
class BufferedRunner extends Runner {
  /**
   * Runs Mocha tests by creating a thread pool, then delegating work to the
   * worker threads. Each worker receives one file, and as workers become
   * available, they take a file from the queue and run it.
   * The worker thread execution is treated like an RPC--it returns a `Promise`
   * containing serialized information about the run.  The information is processed
   * as it's received, and emitted to a {@link Reporter}, which is likely listening
   * for these events.
   *
   * @todo handle tests in a specific order, e.g., via `--file`?
   * @todo handle delayed runs?
   * @todo graceful failure
   * @todo audit `BufferedEvent` objects; e.g. do tests need a `parent` prop?
   * @todo should we just instantiate a `Test` object from the `BufferedEvent`?
   * @param {Function} callback - Called with an exit code corresponding to
   * number of test failures.
   * @param {Object} options
   * @param {string[]} options.files - List of test files
   * @param {Options} option.opts - Command-line options
   * @returns {Promise<void>}
   */
  async run(callback, {files, opts}) {
    const pool = Pool(() => spawn(new Worker('./worker.js')), opts.jobs);

    let exitCode = 0;

    this.emit(EVENT_RUN_BEGIN);

    files.forEach(file => {
      debug('enqueueing test file %s', file);
      pool.queue(async run => {
        const [failures, events] = await run(file, opts);
        debug(
          'completed run of file %s; %d failures / %d events',
          file,
          failures,
          events.length
        );
        exitCode += failures; // can this be non-numeric?
        events.forEach(({name, data}) => {
          Object.keys(data).forEach(key => {
            if (key.startsWith('__')) {
              data[key.slice(2)] = () => data[key];
            }
          });
          // maybe we should just expect `err` separately from the worker.
          if (data.err) {
            this.emit(name, data, data.err);
          } else {
            this.emit(name, data);
          }
        });
      });
    });

    await pool.settled(); // nonzero exit code if rejection?
    await pool.terminate();
    this.emit(EVENT_RUN_END);
    callback(exitCode);
  }
}

module.exports = BufferedRunner;
