'use strict';

const os = require('os');
const Runner = require('./runner');
const {EVENT_RUN_BEGIN, EVENT_RUN_END} = Runner.constants;
const debug = require('debug')('mocha:buffered-runner');
const workerpool = require('workerpool');
const {deserialize} = require('./serializer');
const {type} = require('./utils');
const WORKER_PATH = require.resolve('./worker.js');

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
   */
  run(callback, {files, opts}) {
    // This function should _not_ return a `Promise`; its parent
    // (`Runner#run`) is a void function, so this should be as well.
    // However, we want to make use of `async`/`await`, so we use this
    // IIFE.
    (async () => {
      try {
        const jobs = opts.jobs || os.cpus().length - 1;
        debug('starting pool with %d max workers', jobs);
        const pool = workerpool.pool(WORKER_PATH, {
          workerType: 'process',
          maxWorkers: jobs
        });
        const globalBail = type(opts.bail) === 'boolean' && opts.bail;

        let exitCode = 0;
        let didAbort = false;

        this.emit(EVENT_RUN_BEGIN);

        const poolProxy = await pool.proxy();
        await Promise.all(
          files.map(async file => {
            debug('enqueueing test file %s', file);
            try {
              debug('calling run with: %O', [file, opts]);
              const result = await poolProxy.run(file, opts);
              debug(result);
              const {failures, events} = deserialize(result);
              debug(
                'completed run of file %s; %d failures / %d events',
                file,
                failures,
                events.length
              );
              exitCode += failures; // can this be non-numeric?
              let shouldAbort = false;
              let event = events.shift();
              while (event) {
                this.emit(event.eventName, event.data, event.error);
                // prefer event.data._bail over globalBail, if the former is
                // set, since it could be disabled on any given Runnable.
                // if event.data is falsy, event.error will be as well.
                if (
                  (failures || event.error) &&
                  event.data &&
                  (type(event.data._bail) === 'boolean'
                    ? event.data._bail
                    : globalBail)
                ) {
                  debug('terminating pool due to "bail" flag');
                  shouldAbort = true;
                }
                event = events.shift();
              }
              if (shouldAbort) {
                didAbort = true;
                await pool.terminate(true);
              }
            } catch (err) {
              if (!didAbort) {
                debug('terminating pool due to uncaught exception');
                didAbort = true;
                await pool.terminate(true);
                this.uncaught(err);
              } else {
                debug('thread pool terminated; skipping file %s', file);
              }
            } finally {
              debug('done running file %s', file);
            }
          })
        );

        await pool.terminate();

        this.emit(EVENT_RUN_END);
        debug('exiting with code %d', exitCode);
        callback(exitCode);
      } catch (err) {
        // this is an "unknown" error; probably from 3p code
        /* istanbul ignore next */
        process.nextTick(() => {
          throw err;
        });
      }
    })();
  }
}

module.exports = BufferedRunner;
