'use strict';

const debug = require('debug')('mocha:cli:watch');
const path = require('path');
const chokidar = require('chokidar');
const Context = require('../context');
const collectFiles = require('./collect-files');

/**
 * Exports the `watchRun` function that runs mocha in "watch" mode.
 * @see module:lib/cli/run-helpers
 * @module
 * @private
 */

/**
 * Run Mocha in parallel "watch" mode
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Options
 * @param {string[]} [opts.watchFiles] - List of paths and patterns to
 *   watch. If not provided all files with an extension included in
 *   `fileCollectionParams.extension` are watched. See first argument of
 *   `chokidar.watch`.
 * @param {string[]} opts.watchIgnore - List of paths and patterns to
 *   exclude from watching. See `ignored` option of `chokidar`.
 * @param {FileCollectionOptions} fileCollectParams - Parameters that control test
 * @private
 */
exports.watchParallelRun = (
  mocha,
  {watchFiles, watchIgnore},
  fileCollectParams
) => {
  debug('creating parallel watcher');
  return createWatcher(mocha, {
    watchFiles,
    watchIgnore,
    beforeRun({mocha}) {
      // I don't know why we're cloning the root suite.
      const rootSuite = mocha.suite.clone();

      // this `require` is needed because the require cache has been cleared.  the dynamic
      // exports set via the below call to `mocha.ui()` won't work properly if a
      // test depends on this module (see `required-tokens.spec.js`).
      const Mocha = require('../mocha');

      // ... and now that we've gotten a new module, we need to use it again due
      // to `mocha.ui()` call
      const newMocha = new Mocha(mocha.options);
      // don't know why this is needed
      newMocha.suite = rootSuite;
      // nor this
      newMocha.suite.ctx = new Context();

      // reset the list of files
      newMocha.files = collectFiles(fileCollectParams);

      // because we've swapped out the root suite (see the `run` inner function
      // in `createRerunner`), we need to call `mocha.ui()` again to set up the context/globals.
      newMocha.ui(newMocha.options.ui);

      // we need to call `newMocha.rootHooks` to set up rootHooks for the new
      // suite
      newMocha.rootHooks(newMocha.options.rootHooks);

      // in parallel mode, the main Mocha process doesn't actually load the
      // files. this flag prevents `mocha.run()` from autoloading.
      newMocha.lazyLoadFiles(true);
      return newMocha;
    },
    afterRun({watcher}) {
      blastCache(watcher);
    },
    fileCollectParams
  });
};

/**
 * Run Mocha in "watch" mode
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Options
 * @param {string[]} [opts.watchFiles] - List of paths and patterns to
 *   watch. If not provided all files with an extension included in
 *   `fileCollectionParams.extension` are watched. See first argument of
 *   `chokidar.watch`.
 * @param {string[]} opts.watchIgnore - List of paths and patterns to
 *   exclude from watching. See `ignored` option of `chokidar`.
 * @param {FileCollectionOptions} fileCollectParams - Parameters that control test
 *   file collection. See `lib/cli/collect-files.js`.
 * @private
 */
exports.watchRun = (mocha, {watchFiles, watchIgnore}, fileCollectParams) => {
  debug('creating serial watcher');
  // list of all test files

  return createWatcher(mocha, {
    watchFiles,
    watchIgnore,
    beforeRun({mocha}) {
      mocha.unloadFiles();

      // I don't know why we're cloning the root suite.
      const rootSuite = mocha.suite.clone();

      // this `require` is needed because the require cache has been cleared.  the dynamic
      // exports set via the below call to `mocha.ui()` won't work properly if a
      // test depends on this module (see `required-tokens.spec.js`).
      const Mocha = require('../mocha');

      // ... and now that we've gotten a new module, we need to use it again due
      // to `mocha.ui()` call
      const newMocha = new Mocha(mocha.options);
      // don't know why this is needed
      newMocha.suite = rootSuite;
      // nor this
      newMocha.suite.ctx = new Context();

      // reset the list of files
      newMocha.files = collectFiles(fileCollectParams);

      // because we've swapped out the root suite (see the `run` inner function
      // in `createRerunner`), we need to call `mocha.ui()` again to set up the context/globals.
      newMocha.ui(newMocha.options.ui);

      // we need to call `newMocha.rootHooks` to set up rootHooks for the new
      // suite
      newMocha.rootHooks(newMocha.options.rootHooks);

      return newMocha;
    },
    afterRun({watcher}) {
      blastCache(watcher);
    },
    fileCollectParams
  });
};

/**
 * Bootstraps a chokidar watcher. Handles keyboard input & signals
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts
 * @param {BeforeWatchRun} [opts.beforeRun] - Function to call before
 * `mocha.run()`
 * @param {AfterWatchRun} [opts.afterRun] - Function to call after `mocha.run()`
 * @param {string[]} [opts.watchFiles] - List of paths and patterns to watch. If
 *   not provided all files with an extension included in
 *   `fileCollectionParams.extension` are watched. See first argument of
 *   `chokidar.watch`.
 * @param {string[]} [opts.watchIgnore] - List of paths and patterns to exclude
 *   from watching. See `ignored` option of `chokidar`.
 * @param {FileCollectionOptions} opts.fileCollectParams - List of extensions to watch if `opts.watchFiles` is not given.
 * @returns {FSWatcher}
 * @ignore
 * @private
 */
const createWatcher = (
  mocha,
  {watchFiles, watchIgnore, beforeRun, afterRun, fileCollectParams}
) => {
  if (!watchFiles) {
    watchFiles = fileCollectParams.extension.map(ext => `**/*.${ext}`);
  }

  debug('ignoring files matching: %s', watchIgnore);

  const watcher = chokidar.watch(watchFiles, {
    ignored: watchIgnore,
    ignoreInitial: true
  });

  const rerunner = createRerunner(mocha, watcher, {
    beforeRun,
    afterRun
  });

  watcher.on('ready', () => {
    rerunner.run();
  });

  watcher.on('all', () => {
    rerunner.scheduleRun();
  });

  hideCursor();
  process.on('exit', () => {
    showCursor();
  });
  process.on('SIGINT', () => {
    showCursor();
    console.log('\n');
    process.exit(128 + 2);
  });

  // Keyboard shortcut for restarting when "rs\n" is typed (ala Nodemon)
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', data => {
    const str = data
      .toString()
      .trim()
      .toLowerCase();
    if (str === 'rs') rerunner.scheduleRun();
  });

  return watcher;
};

/**
 * Create an object that allows you to rerun tests on the mocha instance.
 *
 * @param {Mocha} mocha - Mocha instance
 * @param {FSWatcher} watcher - chokidar `FSWatcher` instance
 * @param {Object} [opts] - Options!
 * @param {BeforeWatchRun} [opts.beforeRun] - Function to call before `mocha.run()`
 * @param {AfterWatchRun} [opts.afterRun] - Function to call after `mocha.run()`
 * @returns {Rerunner}
 * @ignore
 * @private
 */
const createRerunner = (mocha, watcher, {beforeRun, afterRun} = {}) => {
  // Set to a `Runner` when mocha is running. Set to `null` when mocha is not
  // running.
  let runner = null;

  // true if a file has changed during a test run
  let rerunScheduled = false;

  const run = () => {
    mocha = beforeRun ? beforeRun({mocha, watcher}) : mocha;

    runner = mocha.run(() => {
      debug('finished watch run');
      runner = null;
      afterRun && afterRun({mocha, watcher});
      if (rerunScheduled) {
        rerun();
      } else {
        debug('waiting for changes...');
      }
    });
  };

  const scheduleRun = () => {
    if (rerunScheduled) {
      return;
    }

    rerunScheduled = true;
    if (runner) {
      runner.abort();
    } else {
      rerun();
    }
  };

  const rerun = () => {
    rerunScheduled = false;
    eraseLine();
    run();
  };

  return {
    scheduleRun,
    run
  };
};

/**
 * Return the list of absolute paths watched by a chokidar watcher.
 *
 * @param watcher - Instance of a chokidar watcher
 * @return {string[]} - List of absolute paths
 * @ignore
 * @private
 */
const getWatchedFiles = watcher => {
  const watchedDirs = watcher.getWatched();
  return Object.keys(watchedDirs).reduce(
    (acc, dir) => [
      ...acc,
      ...watchedDirs[dir].map(file => path.join(dir, file))
    ],
    []
  );
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

/**
 * Blast all of the watched files out of `require.cache`
 * @param {FSWatcher} watcher - chokidar FSWatcher
 * @ignore
 * @private
 */
const blastCache = watcher => {
  const files = getWatchedFiles(watcher);
  files.forEach(file => {
    delete require.cache[file];
  });
  debug('deleted %d file(s) from the require cache', files.length);
};

/**
 * Callback to be run before `mocha.run()` is called.
 * Optionally, it can return a new `Mocha` instance.
 * @callback BeforeWatchRun
 * @private
 * @param {{mocha: Mocha, watcher: FSWatcher}} options
 * @returns {Mocha}
 */

/**
 * Callback to be run after `mocha.run()` completes.  Typically used to clear
 * require cache.
 * @callback AfterWatchRun
 * @private
 * @param {{mocha: Mocha, watcher: FSWatcher}} options
 * @returns {void}
 */

/**
 * Object containing run control methods
 * @typedef {Object} Rerunner
 * @private
 * @property {Function} run - Calls `mocha.run()`
 * @property {Function} scheduleRun - Schedules another call to `run`
 */
