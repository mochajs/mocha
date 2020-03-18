'use strict';

const workerpool = require('workerpool');
const Mocha = require('./mocha');
const {handleRequires, validatePlugin} = require('./cli/run-helpers');
const debug = require('debug')('mocha:worker');
const {serialize} = require('./serializer');
let bootstrapped = false;

/**
 * Runs a single test file in a worker thread.
 * @param {string} file - Filepath of test file
 * @param {Options} argv - Parsed command-line options object
 * @returns {Promise<[number, BufferedEvent[]]>} A tuple of failures and
 * serializable event data
 */
async function run(file, argv) {
  debug('running test file %s on process [%d]', file, process.pid);
  // the buffered reporter retains its events; these events are returned
  // from this function back to the main process.
  argv.reporter = require.resolve('./reporters/buffered');
  // if these were set, it would cause infinite recursion by spawning another worker
  delete argv.parallel;
  delete argv.jobs;
  if (!bootstrapped) {
    // setup requires and ui, but only do this once--we will reuse this worker!
    handleRequires(argv.require);
    validatePlugin(argv, 'ui', Mocha.interfaces);
    bootstrapped = true;
    debug('bootstrapped process [%d]', process.pid);
  }
  const mocha = new Mocha(argv);
  mocha.files = [file];
  try {
    await mocha.loadFilesAsync();
  } catch (err) {
    debug(
      'process [%d] rejecting; could not load file %s: %s',
      process.pid,
      file,
      err
    );
    throw err;
  }
  return new Promise(resolve => {
    // TODO: figure out exactly what the sad path looks like here.
    // will depend on allowUncaught
    // rejection should only happen if an error is "unrecoverable"
    mocha.run(result => {
      process.removeAllListeners('uncaughtException');
      debug('process [%d] resolving', process.pid);
      resolve(serialize(result));
    });
  });
}

workerpool.worker({
  run
});

process.on('beforeExit', () => {
  debug('process [%d] exiting', process.pid);
});
