'use strict';

const allSettled = require('promise.allsettled');
const os = require('os');
const Runner = require('./runner');
const {EVENT_RUN_BEGIN, EVENT_RUN_END} = Runner.constants;
const debug = require('debug')('mocha:parallel:buffered-runner');
const workerpool = require('workerpool');
const {deserialize} = require('./serializer');
const WORKER_PATH = require.resolve('./worker.js');
const {setInterval, clearInterval} = global;
const debugStats = pool => {
  const {totalWorkers, busyWorkers, idleWorkers, pendingTasks} = pool.stats();
  debug(
    '%d/%d busy workers; %d idle; %d tasks queued',
    busyWorkers,
    totalWorkers,
    idleWorkers,
    pendingTasks
  );
};

/**
 * The interval at which we will display stats for worker processes in debug mode
 */
const DEBUG_STATS_INTERVAL = 5000;

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
   * @todo handle delayed runs?
   * @param {Function} callback - Called with an exit code corresponding to
   * number of test failures.
   * @param {{files: string[], options: Options}} opts - Files to run and
   * command-line options, respectively.
   */
  run(callback, {files, options} = {}) {
    /**
     * Listener on `Process.SIGINT` which tries to cleanly terminate the worker pool.
     */
    let sigIntListener;
    // This function should _not_ return a `Promise`; its parent (`Runner#run`)
    // returns this instance, so this should do the same. However, we want to make
    // use of `async`/`await`, so we use this IIFE.

    (async () => {
      /**
       * This is an interval that outputs stats about the worker pool every so often
       */
      let debugInterval;

      /**
       * @type {WorkerPool}
       */
      let pool;

      try {
        const jobs = options.jobs || os.cpus().length - 1;
        debug('run(): starting pool with %d max workers', jobs);
        pool = workerpool.pool(WORKER_PATH, {
          workerType: 'process',
          maxWorkers: jobs
        });

        sigIntListener = async () => {
          if (!didAbort) {
            didAbort = true;
            try {
              debug('shutting down %d (max) workers', jobs);
              await pool.terminate(true);
            } catch (err) {
              console.error(err);
            } finally {
              process.exit(128);
            }
          }
        };

        process.on('SIGINT', sigIntListener);

        /**
         * This flag is used by all workers in the pool; it tells them that we
         * aborted _on purpose_, because of "bail".  If it's _not_ true, an
         * abnormal termination of the worker process is considered a fatal
         * error.
         */
        let didAbort = false;

        // the "pool proxy" object is essentially just syntactic sugar to call a
        // worker's procedure as one would a regular function.
        const poolProxy = await pool.proxy();

        debugInterval = setInterval(
          () => debugStats(pool),
          DEBUG_STATS_INTERVAL
        ).unref();

        // this is set for uncaught exception handling in `Runner#uncaught`
        this.started = true;
        this.emit(EVENT_RUN_BEGIN);

        const results = await allSettled(
          files.map(async file => {
            debug('run(): enqueueing test file %s', file);
            try {
              const result = await poolProxy.run(file, options);
              const {failureCount, events} = deserialize(result);
              debug(
                'run(): completed run of file %s; %d failures / %d events',
                file,
                failureCount,
                events.length
              );
              this.failures += failureCount; // can this ever be non-numeric?
              /**
               * If we set this, then we encountered a "bail" flag, and will
               * terminate the pool once all events have been emitted.
               */
              let shouldAbort = false;
              let event = events.shift();
              while (event) {
                this.emit(event.eventName, event.data, event.error);
                if (
                  (failureCount || event.error) &&
                  event.data &&
                  event.data._bail
                ) {
                  debug('run(): nonzero failure count & found bail flag');
                  // we need to let the events complete for this file, as the worker
                  // should run any cleanup hooks
                  shouldAbort = true;
                }
                event = events.shift();
              }
              if (shouldAbort) {
                didAbort = true;
                debug('run(): terminating pool due to "bail" flag');
                await pool.terminate(true);
              }
            } catch (err) {
              if (didAbort) {
                debug(
                  'run(): worker pool terminated with intent; skipping file %s',
                  file
                );
              } else {
                // this is an uncaught exception
                if (this.allowUncaught) {
                  debug(
                    'run(): found uncaught exception with --allow-uncaught'
                  );
                  // still have to clean up
                  didAbort = true;
                  await pool.terminate(true);
                } else {
                  debug('run(): found uncaught exception: %O', err);
                }
                throw err;
              }
            } finally {
              debug('run(): done running file %s', file);
            }
          })
        );

        // note that pool may already be terminated due to --bail
        await pool.terminate();

        results
          .filter(({status}) => status === 'rejected')
          .forEach(({reason}) => {
            if (this.allowUncaught) {
              throw reason;
            }
            // "rejected" will correspond to uncaught exceptions.
            // unlike the serial runner, the parallel runner can always recover.
            this.uncaught(reason);
          });

        this.emit(EVENT_RUN_END);
        debug('run(): completing with failure count %d', this.failures);
        callback(this.failures);
      } catch (err) {
        // this is probably from an uncaught exception and this.allowUncaught.
        // Promise would trap this otherwise
        process.nextTick(() => {
          debug('run(): throwing uncaught exception');
          process.exitCode = process.exitCode || this.failures || 1;
          throw err;
        });
      } finally {
        clearInterval(debugInterval);
        process.removeListener('SIGINT', sigIntListener);
      }
    })();
    return this;
  }
}

module.exports = BufferedRunner;
