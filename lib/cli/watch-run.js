'use strict';

const utils = require('../utils');
const Context = require('../context');
const Mocha = require('../mocha');
const collectFiles = require('./collect-files');

/**
 * Exports the `watchRun` function that runs mocha in "watch" mode.
 * @see module:lib/cli/run-helpers
 * @module
 * @private
 */

/**
 * Run Mocha in "watch" mode
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Options
 * @param {string} opts.ui - User interface
 * @param {Object} fileCollectParams - Parameters that control test
 *   file collection. See `lib/cli/collect-files.js`.
 * @param {string[]} fileCollectParams.extension - List of extensions to watch
 * @private
 */
module.exports = (mocha, {ui}, fileCollectParams) => {
  let runner;
  const files = collectFiles(fileCollectParams);

  console.log();
  hideCursor();
  process.on('SIGINT', () => {
    showCursor();
    console.log('\n');
    // By UNIX/Posix convention this indicates that the process was
    // killed by SIGINT which has portable number 2.
    process.exit(128 + 2);
  });

  const watchFiles = utils.files(process.cwd(), fileCollectParams.extension);
  let runAgain = false;

  const loadAndRun = () => {
    try {
      mocha.files = files;
      runAgain = false;
      runner = mocha.run(() => {
        runner = null;
        if (runAgain) {
          rerun();
        }
      });
    } catch (e) {
      console.log(e.stack);
    }
  };

  const purge = () => {
    watchFiles.forEach(Mocha.unloadFile);
  };

  loadAndRun();

  const rerun = () => {
    purge();
    eraseLine();
    mocha.suite = mocha.suite.clone();
    mocha.suite.ctx = new Context();
    mocha.ui(ui);
    loadAndRun();
  };

  utils.watch(watchFiles, () => {
    runAgain = true;
    if (runner) {
      runner.abort();
    } else {
      rerun();
    }
  });
};

/**
 * Hide the cursor.
 * @ignore
 * @private
 */
const hideCursor = () => {
  process.stdout.write('\u001b[?25l');
};

/**
 * Show the cursor.
 * @ignore
 * @private
 */
const showCursor = () => {
  process.stdout.write('\u001b[?25h');
};

/**
 * Erases the line on stdout
 * @private
 */
const eraseLine = () => {
  process.stdout.write('\u001b[2K');
};
