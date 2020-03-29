'use strict';

const {createInvalidArgumentTypeError} = require('./errors');
const workerpool = require('workerpool');
const Mocha = require('./mocha');
const {handleRequires, validatePlugin} = require('./cli/run-helpers');
const debug = require('debug')(`mocha:worker:${process.pid}`);
const {serialize} = require('./serializer');

const BUFFERED_REPORTER_PATH = require.resolve('./reporters/buffered');

if (workerpool.isMainThread) {
  throw new Error(
    'This script is intended to be run as a worker (by the `workerpool` package).'
  );
}

/**
 * Initializes some stuff on the first call to {@link run}.
 *
 * Handles `--require` and `--ui`.  Does _not_ handle `--reporter`,
 * as only the `Buffered` reporter is used.
 *
 * **This function only runs once**; it overwrites itself with a no-op
 * before returning.
 *
 * @param {Options} argv - Command-line options
 */
let bootstrap = argv => {
  handleRequires(argv.require);
  validatePlugin(argv, 'ui', Mocha.interfaces);
  process.on('beforeExit', () => {
    /* istanbul ignore next */
    debug('exiting');
  });
  debug('bootstrapped');
  bootstrap = () => {};
};

/**
 * Runs a single test file in a worker thread.
 * @param {string} filepath - Filepath of test file
 * @param {Options} [argv] - Parsed command-line options object
 * @returns {Promise<{failures: number, events: BufferedEvent[]}>} - Test
 * failure count and list of events.
 */
async function run(filepath, argv = {ui: 'bdd'}) {
  if (!filepath) {
    throw createInvalidArgumentTypeError(
      'Expected a non-empty "filepath" argument',
      'file',
      'string'
    );
  }

  debug('running test file %s', filepath);

  const opts = Object.assign(argv, {
    // workers only use the `Buffered` reporter.
    reporter: BUFFERED_REPORTER_PATH,
    // if this was true, it would cause infinite recursion.
    parallel: false
  });

  bootstrap(opts);

  const mocha = new Mocha(opts).addFile(filepath);

  try {
    await mocha.loadFilesAsync();
  } catch (err) {
    debug('could not load file %s: %s', filepath, err);
    throw err;
  }

  return new Promise((resolve, reject) => {
    mocha.run(result => {
      // Runner adds these; if we don't remove them, we'll get a leak.
      process.removeAllListeners('uncaughtException');

      debug('completed run with %d test failures', result.failures);
      try {
        const serialized = serialize(result);
        debug('returning to main process');
        resolve(serialized);
      } catch (err) {
        // TODO: figure out exactly what the sad path looks like here.
        // rejection should only happen if an error is "unrecoverable"
        debug('rejecting: %O', err);
        reject(err);
      }
    });
  });
}

// this registers the `run` function.
workerpool.worker({run});

debug('started worker process');

// for testing
exports.run = run;
