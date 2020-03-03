'use strict';

const {expose} = require('threads/worker');
const Mocha = require('./mocha');
const {handleRequires, validatePlugin} = require('./cli/run-helpers');

let bootstrapped = false;

/**
 * Runs a single test file in a worker thread.
 * @param {string} file - Filepath of test file
 * @param {Options} argv - Parsed command-line options object
 * @returns {Promise<[number, BufferedEvent[]]>} A tuple of failures and
 * serializable event data
 */
async function run(file, argv) {
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
  }
  const mocha = new Mocha(argv);
  mocha.files = [file];
  await mocha.loadFilesAsync();
  return new Promise(resolve => {
    mocha.run((failures, events) => {
      resolve([failures, events]);
    });
  });
}

expose(run);
