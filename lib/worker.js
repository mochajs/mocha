'use strict';

const {createInvalidArgumentTypeError} = require('./errors');
const workerpool = require('workerpool');
const Mocha = require('./mocha');
const {
  handleRequires,
  validatePlugin,
  loadRootHooks
} = require('./cli/run-helpers');
const debug = require('debug')(`mocha:parallel:worker:${process.pid}`);
const {serialize} = require('./serializer');
const {setInterval, clearInterval} = global;

const BUFFERED_REPORTER_PATH = require.resolve('./reporters/buffered');

let rootHooks;

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
 * **This function only runs once per worker**; it overwrites itself with a no-op
 * before returning.
 *
 * @param {Options} argv - Command-line options
 */
let bootstrap = async argv => {
  const rawRootHooks = handleRequires(argv.require);
  rootHooks = await loadRootHooks(rawRootHooks);
  validatePlugin(argv, 'ui', Mocha.interfaces);
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

  debug('run(): running test file %s', filepath);

  const opts = Object.assign(argv, {
    // workers only use the `Buffered` reporter.
    reporter: BUFFERED_REPORTER_PATH,
    // if this was true, it would cause infinite recursion.
    parallel: false
  });

  await bootstrap(opts);

  opts.rootHooks = rootHooks;

  const mocha = new Mocha(opts).addFile(filepath);

  try {
    await mocha.loadFilesAsync();
  } catch (err) {
    debug('run(): could not load file %s: %s', filepath, err);
    throw err;
  }

  return new Promise((resolve, reject) => {
    const t = setInterval(() => {
      debug('run(): still running %s...', filepath);
    }, 5000).unref();
    mocha.run(result => {
      // Runner adds these; if we don't remove them, we'll get a leak.
      process.removeAllListeners('uncaughtException');

      try {
        const serialized = serialize(result);
        debug(
          'run(): completed run with %d test failures; returning to main process',
          typeof result.failures === 'number' ? result.failures : 0
        );
        resolve(serialized);
      } catch (err) {
        // TODO: figure out exactly what the sad path looks like here.
        // rejection should only happen if an error is "unrecoverable"
        debug('run(): serialization failed; rejecting: %O', err);
        reject(err);
      } finally {
        clearInterval(t);
      }
    });
  });
}

// this registers the `run` function.
workerpool.worker({run});

debug('started worker process');

// for testing
exports.run = run;
