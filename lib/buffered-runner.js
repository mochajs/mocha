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
const {createMap, warn} = require('./utils');
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

const ABORTED = 'ABORTED';
const IDLE = 'IDLE';
const ABORTING = 'ABORTING';
const RUNNING = 'RUNNING';
const BAILING = 'BAILING';
const BAILED = 'BAILED';
const COMPLETE = 'COMPLETE';

const states = createMap({
  [IDLE]: new Set([RUNNING, ABORTING]),
  [RUNNING]: new Set([COMPLETE, BAILING, ABORTING]),
  [COMPLETE]: new Set(),
  [ABORTED]: new Set(),
  [ABORTING]: new Set([ABORTED]),
  [BAILING]: new Set([BAILED, ABORTING]),
  [BAILED]: new Set([COMPLETE, ABORTING])
});

/**
 * This `Runner` delegates tests runs to worker threads.  Does not execute any
 * {@link Runnable}s by itself!
 */
class BufferedRunner extends Runner {
  constructor(...args) {
    super(...args);

    let state = IDLE;
    Object.defineProperty(this, '_state', {
      get() {
        return state;
      },
      set(newState) {
        if (states[state].has(newState)) {
          state = newState;
        } else {
          throw new Error(`invalid state transition: ${state} => ${newState}`);
        }
      }
    });

    this.once('EVENT_RUN_END', () => {
      this._state = COMPLETE;
    });
  }

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
        const cpuCount = os.cpus().length;
        const maxJobs = cpuCount - 1;
        const jobs = Math.max(1, Math.min(options.jobs || maxJobs, maxJobs));
        if (maxJobs < 2) {
          warn(
            `(Mocha) not enough CPU cores available (${cpuCount}) to run multiple jobs; avoid --parallel on this machine`
          );
        } else if (options.jobs && options.jobs > maxJobs) {
          warn(
            `(Mocha) ${options.jobs} concurrent jobs requested, but only enough cores available for ${maxJobs}`
          );
        }
        debug(
          'run(): starting worker pool of size %d, using node args: %s',
          jobs,
          process.execArgv.join(' ')
        );
        pool = workerpool.pool(WORKER_PATH, {
          workerType: 'process',
          maxWorkers: jobs,
          forkOpts: {execArgv: process.execArgv}
        });

        sigIntListener = async () => {
          if (this._state !== ABORTING) {
            debug('run(): caught a SIGINT');
            this._state = ABORTING;

            try {
              debug('run(): shutting down %d (max) workers', jobs);
              await pool.terminate(true);
            } catch (err) {
              console.error(
                `Error while attempting to force-terminate worker pool: ${err}`
              );
            } finally {
              process.nextTick(() => {
                debug('run(): imminent death');
                this._state = ABORTED;
                process.kill(process.pid, 'SIGINT');
              });
            }
          }
        };

        process.once('SIGINT', sigIntListener);

        // the "pool proxy" object is essentially just syntactic sugar to call a
        // worker's procedure as one would a regular function.
        const poolProxy = await pool.proxy();

        debugInterval = setInterval(
          () => debugStats(pool),
          DEBUG_STATS_INTERVAL
        ).unref();

        // this is set for uncaught exception handling in `Runner#uncaught`
        this.started = true;
        this._state = RUNNING;

        this.emit(EVENT_RUN_BEGIN);

        const results = await allSettled(
          files.map(async file => {
            debug('run(): enqueueing test file %s', file);
            try {
              const result = await poolProxy.run(file, options);
              if (this._state === BAILED) {
                // short-circuit after a graceful bail
                return;
              }
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
              let event = events.shift();
              while (event) {
                this.emit(event.eventName, event.data, event.error);
                if (
                  this._state !== BAILING &&
                  event.data &&
                  event.data._bail &&
                  (failureCount || event.error)
                ) {
                  debug('run(): nonzero failure count & found bail flag');
                  // we need to let the events complete for this file, as the worker
                  // should run any cleanup hooks
                  this._state = BAILING;
                }
                event = events.shift();
              }
              if (this._state === BAILING) {
                debug('run(): terminating pool due to "bail" flag');
                this._state = BAILED;
                await pool.terminate();
              }
            } catch (err) {
              if (this._state === BAILED || this._state === ABORTING) {
                debug(
                  'run(): worker pool terminated with intent; skipping file %s',
                  file
                );
              } else {
                // this is an uncaught exception
                debug('run(): encountered uncaught exception: %O', err);
                if (this.allowUncaught) {
                  // still have to clean up
                  this._state = ABORTING;
                  await pool.terminate(true);
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
              // yep, just the first one.
              throw reason;
            }
            // "rejected" will correspond to uncaught exceptions.
            // unlike the serial runner, the parallel runner can always recover.
            this.uncaught(reason);
          });

        if (this._state === ABORTING) {
          return;
        }
        this.emit(EVENT_RUN_END);
        debug('run(): completing with failure count %d', this.failures);
        callback(this.failures);
      } catch (err) {
        process.nextTick(() => {
          debug('run(): throwing uncaught exception');
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
