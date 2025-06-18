'use strict';

const logSymbols = require('log-symbols');
const debug = require('debug')('mocha:cli:watch');
const fs = require('node:fs');
const path = require('node:path');
const chokidar = require('chokidar');
const {minimatch} = require('minimatch');
const {Glob} = require('glob');
const Context = require('../context');
const {castArray} = require('../utils');
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

      // ensure we aren't leaking event listeners
      mocha.dispose();

      // this `require` is needed because the require cache has been cleared.  the dynamic
      // exports set via the below call to `mocha.ui()` won't work properly if a
      // test depends on this module.
      const Mocha = require('../mocha');

      // ... and now that we've gotten a new module, we need to use it again due
      // to `mocha.ui()` call
      const newMocha = new Mocha(mocha.options);
      // don't know why this is needed
      newMocha.suite = rootSuite;
      // nor this
      newMocha.suite.ctx = new Context();

      // reset the list of files
      newMocha.files = collectFiles(fileCollectParams).files;

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

  return createWatcher(mocha, {
    watchFiles,
    watchIgnore,
    beforeRun({mocha}) {
      mocha.unloadFiles();

      // I don't know why we're cloning the root suite.
      const rootSuite = mocha.suite.clone();

      // ensure we aren't leaking event listeners
      mocha.dispose();

      // this `require` is needed because the require cache has been cleared.  the dynamic
      // exports set via the below call to `mocha.ui()` won't work properly if a
      // test depends on this module.
      const Mocha = require('../mocha');

      // ... and now that we've gotten a new module, we need to use it again due
      // to `mocha.ui()` call
      const newMocha = new Mocha(mocha.options);
      // don't know why this is needed
      newMocha.suite = rootSuite;
      // nor this
      newMocha.suite.ctx = new Context();

      // reset the list of files
      newMocha.files = collectFiles(fileCollectParams).files;

      // because we've swapped out the root suite (see the `run` inner function
      // in `createRerunner`), we need to call `mocha.ui()` again to set up the context/globals.
      newMocha.ui(newMocha.options.ui);

      // we need to call `newMocha.rootHooks` to set up rootHooks for the new
      // suite
      newMocha.rootHooks(newMocha.options.rootHooks);

      return newMocha;
    },
    fileCollectParams
  });
};

/**
 * Strips the glob part of the path.
 * @param {string} globPath The path to strip.
 * @param {string} basePath The path where mocha is run (e.g. current working directory).
 * @returns {StrippedGlob} The stripped glob result.
 */
function stripGlob(globPath, basePath) {
  /**
   * Path parts to resolve without glob parts that come from the `globPath`.
   * @type {string[]}
   */
  const paths = [];

  // get first pattern from the glob instance
  const g = new Glob(globPath, {dot: true});
  let pattern = g.patterns.length > 0 ? g.patterns[0] : null;
  let isGlob = false;

  while (pattern) {
    // if `pattern` is a string, then save it to `paths` to resolve,
    // otherwise stop if non-string (glob or regexp) was matched
    const entry = pattern.pattern();
    if (typeof entry !== 'string' || !pattern.isString()) {
      isGlob = true;
      break;
    }

    paths.push(entry);
    // go to next pattern
    pattern = pattern.rest();
  }

  let cleanPath = path.resolve(basePath, ...paths);
  // preserve absolute or relative path from `globPath`
  if (!path.isAbsolute(globPath)) {
    cleanPath = path.relative(basePath, cleanPath) || '.';
  }

  return {path: cleanPath, isGlob};
}

/**
 * Resolves the list of paths to valid paths (no globs) and creates matchers
 * that can be used to allow or ignore chokidar watch file paths.
 * @param {string[]} paths The list of paths to resolve.
 * @param {string} basePath The path where mocha is run (e.g. current working directory).
 * @returns {ResolvedPaths} The resolved paths.
 * @ignore
 * @private
 */
function resolvePaths(paths, basePath) {
  /**
   * List of valid paths for chokidar.
   * @type {Set<string>}
   */
  const validPathsSet = new Set();

  /**
   * List of path matchers.
   * @type {PathMatch[]}
   */
  const matchers = [];

  for (const filePath of paths) {
    const stripped = stripGlob(filePath, basePath);
    const cleanPath = path.resolve(stripped.path);

    validPathsSet.add(cleanPath);

    if (stripped.isGlob) {
      matchers.push(
        // for matching directory paths for and under `cleanPath`
        {type: 'dir', match: cleanPath},
        // for matching glob paths if `filePath` is a glob
        {type: 'glob', match: path.resolve(basePath, filePath)}
      );
    } else {
      matchers.push(
        // for matching exact files and directories
        {type: 'exact', match: cleanPath},
        // for matching contents under directories
        {type: 'contents', match: cleanPath}
      );
    }
  }

  return {paths: Array.from(validPathsSet), matchers};
}

/**
 * Creates a match function for chokidar `ignored` option.
 * @param {PathMatch[]} validMatchers The list of matchers that would allow matching paths.
 * @param {PathMatch[]} ignoreMatchers The list of matchers that would ignore matching paths.
 * @param {string} basePath The path where mocha is run (e.g. current working directory).
 * @returns {chokidar.MatchFunction} The chokidar `ignored` match function.
 * @ignore
 * @private
 */
function createIgnoreMatchFunction(validMatchers, ignoreMatchers, basePath) {
  return function (filePath, stats) {
    // for some reason, chokidar calls the ignore match function twice:
    // once without `stats` and again with `stats`
    // see `ignored` under https://github.com/paulmillr/chokidar?tab=readme-ov-file#path-filtering
    // note that the second call can also have no `stats` if the `filePath` does not exist
    // in which case, allow the non-existent path since it may be created later
    if (!stats) {
      return false;
    }

    // ensure absolute path
    filePath = path.resolve(basePath, filePath);

    /**
     * The successful match. Note that the matcher is not referenced
     * but including it might be useful for debugging.
     * @type {{ ignore: boolean; matcher: PathMatch; } | undefined}
     */
    let matchedBy;

    // the match check below prioritizes `watchIgnore` by processing
    // the `ignoreMatchers` array first so that the `filePath` is ignored early
    matchersLoop: for (const matchers of [ignoreMatchers, validMatchers]) {
      for (const matcher of matchers) {
        /**
         * The pattern to match with `minimatch`, if any.
         * @type {string | undefined}
         */
        let pattern;
        let match = false;

        if (matcher.type === 'exact') {
          // perform exact match with absolute paths
          match = matcher.match === filePath;
        } else if (matcher.type === 'contents') {
          const matchStats = fs.statSync(matcher.match, {
            throwIfNoEntry: false
          });

          // note that the match path may not always exist (e.g. user deletes directory)
          if (!matchStats || matchStats.isDirectory()) {
            // create an absolute path glob pattern ending with '**/*'
            // to match all contents under the match path
            pattern = path.resolve(matcher.match, '**', '*');
          }
        } else if (matcher.type === 'glob') {
          // if matching 'glob' type, set the match path as pattern
          pattern = matcher.match;
        } else {
          // if matching for 'dir' type, check if the `filePath` is a directory
          match = stats.isDirectory();
        }

        // match by pattern
        if (!match && pattern != null) {
          match = minimatch(filePath, pattern, {
            dot: true,
            windowsPathsNoEscape: true
          });
        }

        if (match) {
          // ignore the `filePath` if it was matched from the `ignoreMatchers` array
          matchedBy = {matcher, ignore: matchers === ignoreMatchers};
          break matchersLoop;
        }
      }
    }

    return !matchedBy || matchedBy.ignore;
  };
}

/**
 * Bootstraps a chokidar watcher. Handles keyboard input & signals
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts
 * @param {BeforeWatchRun} [opts.beforeRun] - Function to call before
 * `mocha.run()`
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
  {watchFiles, watchIgnore, beforeRun, fileCollectParams}
) => {
  if (!watchFiles) {
    watchFiles = fileCollectParams.extension.map(ext => `**/*.${ext}`);
  }

  debug('ignoring files matching: %s', watchIgnore);
  let globalFixtureContext;

  // we handle global fixtures manually
  mocha.enableGlobalSetup(false).enableGlobalTeardown(false);

  // glob file paths are no longer supported by chokidar starting at v4
  // first, strip the globs from `watchFiles` (paths for chokidar to watch)
  // then, get file or directory paths to ignore from `watchIgnore`
  // using these paths, create a list of matchers to determine if files
  // should be allowed or ignored through the chokidar `ignored` match function

  const basePath = process.cwd();
  const allow = resolvePaths(watchFiles, basePath);
  const ignore = resolvePaths(castArray(watchIgnore), basePath);

  const watcher = chokidar.watch(allow.paths, {
    ignoreInitial: true,
    // including `watchIgnore`s in the `ignored` array does not ignore files
    // so they are included in the ignore match function check instead
    ignored: createIgnoreMatchFunction(
      allow.matchers,
      ignore.matchers,
      basePath
    )
  });

  const rerunner = createRerunner(mocha, watcher, {
    beforeRun
  });

  watcher.on('ready', async () => {
    if (!globalFixtureContext) {
      debug('triggering global setup');
      globalFixtureContext = await mocha.runGlobalSetup();
    }
    rerunner.run();
  });

  watcher.on('all', () => {
    rerunner.scheduleRun();
  });

  hideCursor();
  process.on('exit', () => {
    showCursor();
  });

  // this is for testing.
  // win32 cannot gracefully shutdown via a signal from a parent
  // process; a `SIGINT` from a parent will cause the process
  // to immediately exit.  during normal course of operation, a user
  // will type Ctrl-C and the listener will be invoked, but this
  // is not possible in automated testing.
  // there may be another way to solve this, but it too will be a hack.
  // for our watch tests on win32 we must _fork_ mocha with an IPC channel
  if (process.connected) {
    process.on('message', msg => {
      if (msg === 'SIGINT') {
        process.emit('SIGINT');
      }
    });
  }

  let exiting = false;
  process.on('SIGINT', async () => {
    showCursor();
    console.error(`${logSymbols.warning} [mocha] cleaning up, please wait...`);
    if (!exiting) {
      exiting = true;
      if (mocha.hasGlobalTeardownFixtures()) {
        debug('running global teardown');
        try {
          await mocha.runGlobalTeardown(globalFixtureContext);
        } catch (err) {
          console.error(err);
        }
      }
      process.exit(130);
    }
  });

  // Keyboard shortcut for restarting when "rs\n" is typed (ala Nodemon)
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', data => {
    const str = data.toString().trim().toLowerCase();
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
 * @returns {Rerunner}
 * @ignore
 * @private
 */
const createRerunner = (mocha, watcher, {beforeRun} = {}) => {
  // Set to a `Runner` when mocha is running. Set to `null` when mocha is not
  // running.
  let runner = null;

  // true if a file has changed during a test run
  let rerunScheduled = false;

  const run = () => {
    try {
      mocha = beforeRun ? beforeRun({mocha, watcher}) || mocha : mocha;
      runner = mocha.run(() => {
        debug('finished watch run');
        runner = null;
        blastCache(watcher);
        if (rerunScheduled) {
          rerun();
        } else {
          console.error(`${logSymbols.info} [mocha] waiting for changes...`);
        }
      });
    } catch (e) {
      console.error(e.stack);
    }
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
 * Object containing run control methods
 * @typedef {Object} Rerunner
 * @private
 * @property {Function} run - Calls `mocha.run()`
 * @property {Function} scheduleRun - Schedules another call to `run`
 */

/**
 * The stripped glob result containing the `path` without the glob part
 * and a flag if the original `path` is a glob.
 * @private
 * @typedef {Object} StrippedGlob
 * @property {string} path The absolute path without the glob part.
 * @property {boolean} isGlob Determines if the original `path` is a glob.
 */

/**
 * The matcher for an entry from `watchFiles`.
 * @private
 * @typedef {Object} PathMatch
 * @property {"exact"|"contents"|"dir"|"glob"} type The match type that determines the matching logic to perform.
 * - `exact` - Match the exact file or directory paths.
 * - `contents` - Match contents under directory paths.
 * - `dir` - Match the exact directory itself and directories under it.
 * - `glob` - Match file or directory paths with `minimatch`.
 * @property {string} match The exact absolute path or absolute glob pattern to match.
 */

/**
 * The object result after resolving a list of paths.
 * @private
 * @typedef {Object} ResolvedPaths
 * @property {string[]} paths The paths to watch for chokidar.
 * @property {PathMatch[]} matchers The list of matchers to be used for the chokidar `ignored` match function.
 */
