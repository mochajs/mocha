'use strict';

const logSymbols = require('log-symbols');
const chokidar = require('chokidar');
const debug = require('debug')('mocha:cli:interactive-watch:run');

const Context = require('../../context');
const {blastCache} = require('../watch-run');
const {printStats, printTestRunnerUsageOneLine} = require('./print');

exports.createWatcher = (mocha, {watchFiles, watchIgnore, extension}) => {
  debug('creating interactive watcher');
  debug('default extension: %s', extension);

  if (!watchFiles) {
    watchFiles = extension.map(ext => `**/*.${ext}`);
  }

  debug('ignoring files matching: %s', watchIgnore);
  debug('watching files matching: %s', watchFiles);

  // we handle global fixtures manually
  mocha.enableGlobalSetup(false).enableGlobalTeardown(false);

  const watcher = chokidar.watch(watchFiles, {
    ignored: watchIgnore, // ['node_modules', '.git'] ignored by default
    ignoreInitial: true
  });

  const reRunner = createReRunner(mocha, watcher);

  return {
    watcher,
    reRunner
  };
};

const createReRunner = (mocha, watcher) => {
  // Set to a `Runner` when mocha is running. Set to `null` when mocha is not running.
  let runner = null;

  // true if a file has changed during a test run
  let rerunScheduled = false;

  const run = filesToBeRun => {
    try {
      mocha = beforeRun({mocha, filesToBeRun});

      runner = mocha.run(() => {
        debug('finished watch run');

        const {stats} = runner;
        debug('runner stats: ', stats);

        runner = null;
        blastCache(watcher);

        if (rerunScheduled) {
          debug('rerunning scheduled run for: %s', filesToBeRun);
          rerun(filesToBeRun);
        } else {
          printStats(stats);
          printTestRunnerUsageOneLine();
          console.log(` ${logSymbols.info} [mocha] waiting for changes...`);
        }
      });
    } catch (err) {
      console.error(err.stack);
    }
  };

  const scheduleRun = filesToBeRun => {
    if (rerunScheduled) return;

    rerunScheduled = true;

    if (runner) {
      runner.abort();
    } else {
      rerun(filesToBeRun);
    }
  };

  const rerun = filesToBeRun => {
    rerunScheduled = false;
    run(filesToBeRun);
  };

  const getRunner = () => runner;

  return {
    scheduleRun,
    run,
    getRunner
  };
};

function beforeRun({mocha, filesToBeRun}) {
  mocha.unloadFiles();

  // I don't know why we're cloning the root suite.
  const rootSuite = mocha.suite.clone();

  // ensure we aren't leaking event listeners
  mocha.dispose();

  // this `require` is needed because the require cache has been cleared.  the dynamic
  // exports set via the below call to `mocha.ui()` won't work properly if a
  // test depends on this module (see `required-tokens.spec.js`).
  const Mocha = require('../../mocha');

  // ... and now that we've gotten a new module, we need to use it again due
  // to `mocha.ui()` call
  const newMocha = new Mocha(mocha.options);
  // don't know why this is needed
  newMocha.suite = rootSuite;
  // nor this
  newMocha.suite.ctx = new Context();

  // reset the list of files
  newMocha.files = filesToBeRun;

  // because we've swapped out the root suite (see the `run` inner function
  // in `createRerunner`), we need to call `mocha.ui()` again to set up the context/globals.
  newMocha.ui(newMocha.options.ui);

  // we need to call `newMocha.rootHooks` to set up rootHooks for the new
  // suite
  newMocha.rootHooks(newMocha.options.rootHooks);

  return newMocha;
}
