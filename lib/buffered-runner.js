'use strict';

const os = require('os');
const Runner = require('./runner');
const {EVENT_RUN_BEGIN, EVENT_RUN_END} = Runner.constants;
const debug = require('debug')('mocha:parallel:buffered-runner');
const workerpool = require('workerpool');
const {deserialize} = require('./serializer');
const {warn} = require('./utils');
const WORKER_PATH = require.resolve('./worker.js');
const {setInterval, clearInterval} = global;
const debugStats = pool => {
  const {totalWorkers, busyWorkers, idleWorkers, pendingTasks} = pool.stats();
  debug(
    '%d/%d busy workers; %d idle; %d remaining tasks',
    busyWorkers,
    totalWorkers,
    idleWorkers,
    pendingTasks
  );
};

/**
 * This `Runner` delegates tests runs to worker threads.  Does not execute any
 * {@link Runnable}s by itself!
 */
class BufferedRunner extends Runner {
  /**
   * Runs Mocha tests by creating a thread pool, then delegating work to the
   * worker threads.
   *
   * Each worker receives one file, and as workers become available, they take a
   * file from the queue and run it. The worker thread execution is treated like
   * an RPC--it returns a `Promise` containing serialized information about the
   * run.  The information is processed as it's received, and emitted to a
   * {@link Reporter}, which is likely listening for these events.
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
    // This function should _not_ return a `Promise`; its parent (`Runner#run`)
    // is a void function, so this should be as well. However, we want to make
    // use of `async`/`await`, so we use this IIFE.
    (async () => {
      /**
       * This is an interval that outputs stats about the worker pool every so often
       */
      let debugInterval;

      /**
       * @type {import('workerpool').WorkerPool}
       */
      let pool;

      try {
        if (files.length === 1) {
          // using --parallel on a single file is slower than it needs to be.
          warn(
            '(Mocha) Only one test file detected; consider omitting --parallel'
          );
        }
        const jobs = opts.jobs || os.cpus().length - 1;
        debug('starting pool with %d max workers', jobs);
        pool = workerpool.pool(WORKER_PATH, {
          workerType: 'process',
          maxWorkers: jobs
        });

        let totalFailureCount = 0;

        /**
         * This flag is used by all workers in the pool; it tells them that we
         * aborted _on purpose_, because of "bail".  If it's _not_ true, an
         * abnormal termination of the worker process is considered a fatal
         * error.
         */
        let didAbort = false;

        this.emit(EVENT_RUN_BEGIN);

        // the "pool proxy" object is essentially just syntactic sugar to call a
        // worker's procedure as one would a regular function.
        const poolProxy = await pool.proxy();

        debugInterval = setInterval(() => debugStats(pool), 5000).unref();

        await Promise.all(
          files.map(async file => {
            debug('enqueueing test file %s', file);
            try {
              const result = await poolProxy.run(file, opts);
              const {failureCount, events} = deserialize(result);
              debug(
                'completed run of file %s; %d failures / %d events',
                file,
                failureCount,
                events.length
              );
              totalFailureCount += failureCount; // can this ever be non-numeric?
              /**
               * If we set this, then we encountered a "bail" flag, and will
               * terminate the pool once all events have been emitted.
               */
              let shouldAbort = false;
              let event = events.shift();
              while (event) {
                this.emit(event.eventName, event.data, event.error);
                if (
                  (totalFailureCount || event.error) &&
                  event.data &&
                  event.data._bail
                ) {
                  debug(
                    'nonzero failure count & found bail flag in event: %O',
                    event
                  );
                  // we need to let the events complete for this file, as the worker
                  // should run any cleanup hooks
                  shouldAbort = true;
                }
                event = events.shift();
              }
              if (shouldAbort) {
                didAbort = true;
                debug('terminating pool due to "bail" flag');
                await pool.terminate(true);
              }
              debug('all events reported for file %s', file);
            } catch (err) {
              if (!didAbort) {
                debug('terminating pool due to uncaught exception');
                didAbort = true;
                await pool.terminate(true);
                this.uncaught(err);
              } else {
                debug('worker pool terminated; skipping file %s', file);
              }
            } finally {
              debug('done running file %s', file);
            }
          })
        );

        // note that if we aborted due to "bail", this will have happened
        // already
        await pool.terminate();

        this.emit(EVENT_RUN_END);
        debug('exiting with code %d', totalFailureCount);
        callback(totalFailureCount);
      } catch (err) {
        // this is an "unknown" error; probably from 3p code
        /* istanbul ignore next */
        process.nextTick(() => {
          throw err;
        });
      } finally {
        clearInterval(debugInterval);
        debugStats(pool);
      }
    })();
  }
}

module.exports = BufferedRunner;
