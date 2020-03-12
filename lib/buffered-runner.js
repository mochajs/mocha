'use strict';

const os = require('os');
const Runner = require('./runner');
const {EVENT_RUN_BEGIN, EVENT_RUN_END} = Runner.constants;
const debug = require('debug')('mocha:buffered-runner');
const workerpool = require('workerpool');
const {deserializeMessage} = require('./serializer');

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
    const jobs = opts.jobs || os.cpus().length - 1;
    debug('starting pool with %d max workers', jobs);
    const pool = workerpool.pool(require.resolve('./worker.js'), {
      workerType: 'process',
      maxWorkers: jobs
    });

    let exitCode = 0;
    let aborted = false;

    this.emit(EVENT_RUN_BEGIN);

    const poolProxy = await pool.proxy();
    // const tasks = new Set(
    const results = await Promise.allSettled(
      files.map(async file => {
        debug('enqueueing test file %s', file);
        try {
          const {failures, events} = deserializeMessage(
            await poolProxy.run(file, opts)
          );
          debug(
            'completed run of file %s; %d failures / %d events',
            file,
            failures,
            events.length
          );
          exitCode += failures; // can this be non-numeric?
          let event = events.shift();
          let shouldAbort = false;
          while (event) {
            this.emit(event.eventName, event.data, event.error);
            if (failures && event.data._bail) {
              debug('terminating pool due to "bail" flag');
              shouldAbort = true;
            }
            event = events.shift();
          }
          if (shouldAbort) {
            aborted = true;
            await pool.terminate(true);
          }
        } catch (err) {
          if (!aborted) {
            debug('terminating pool due to uncaught exception');
            await pool.terminate(true);
            this.uncaught(err);
          }
        } finally {
          debug('done running file %s', file);
        }
      })
    );

    await pool.terminate();

    const uncaughtExceptions = results.filter(
      ({status}) => status === 'rejected'
    );
    if (uncaughtExceptions.length) {
      debug('found %d uncaught exceptions', uncaughtExceptions.length);
      process.nextTick(() => {
        throw uncaughtExceptions.shift();
      });
    }
    this.emit(EVENT_RUN_END);
    debug('exiting with code %d', exitCode);
    callback(exitCode);
  }
}

module.exports = BufferedRunner;
