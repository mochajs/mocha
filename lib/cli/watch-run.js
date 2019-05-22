'use strict';

const utils = require('../utils');
const Context = require('../context');
const Mocha = require('../mocha');

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
 * @param {string[]} opts.extension - List of extensions to watch
 * @param {string|RegExp} opts.grep - Grep for test titles
 * @param {string} opts.ui - User interface
 * @param {string[]} opts.files - Array of test files
 * @private
 */
module.exports = (mocha, {extension, grep, ui, files}) => {
  let runner;

  console.log();
  hideCursor();
  process.on('SIGINT', () => {
    showCursor();
    console.log('\n');
    // By UNIX/Posix convention this indicates that the process was
    // killed by SIGINT which has portable number 2.
    process.exit(128 + 2);
  });

  const watchFiles = utils.files(process.cwd(), extension);
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
    if (!grep) {
      mocha.grep(null);
    }
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
