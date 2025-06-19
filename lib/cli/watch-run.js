'use strict';

const logSymbols = require('log-symbols');
const debug = require('debug')('mocha:cli:watch');
const path = require('node:path');
const chokidar = require('chokidar');
const glob = require('glob');
const {minimatch} = require('minimatch');
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
 * Normalizes the glob path to extract out the path without the glob part
 * and with the full glob path equivalent. This can return more than one
 * normalized glob path as `magicalBraces` would have their own patterns
 * (e.g., `pkg/{lib,dist}` would have the patterns `pkg/lib` and `pkg/dist`).
 * @param {string} globPath The glob path to normalize.
 * @returns {NormalizedGlob[]} The normalized glob paths.
 * @ignore
 * @private
 */
function normalizeGlob(globPath) {
  const globInstance = new glob.Glob(globPath, {
    dot: true,
    magicalBraces: true,
    windowsPathsNoEscape: true
  });

  // each pattern will have its own path because of the `magicalBraces` option
  return globInstance.patterns.map(pattern => {
    /**
     * Path parts to resolve without glob parts that come from the glob pattern.
     * @type {string[]}
     */
    const paths = [];

    /**
     * The current glob pattern to check.
     * @type {typeof pattern | null} The `Pattern` class is not exported by the `glob` package.
     */
    let currentPattern = pattern;
    let isGlob = false;

    do {
      // if `pattern` is a string, then save it to `paths` to resolve,
      // otherwise stop if a non-string (glob or regexp) was matched
      const entry = currentPattern.pattern();
      if (typeof entry !== 'string' || !currentPattern.isString()) {
        isGlob = true;
        break;
      }

      paths.push(entry);

      // go to next pattern
    } while ((currentPattern = currentPattern.rest()));

    /**
     * @type {NormalizedGlob}
     */
    const nglob = {
      path: path.join(...paths),
      // if this path is not a glob (i.e. not `isGlob`), then we can assume
      // that `pattern.globString()` is the same string as the joined paths
      globPath: isGlob ? pattern.globString() : null
    };

    return nglob;
  });
}

/**
 * Creates a list of path patterns from the provided normalized glob paths.
 * @param {NormalizedGlob[]} nglobs The normalized glob paths to create the path patterns.
 * @param {string} basePath The path where mocha is run (e.g., current working directory).
 * @returns {PathPattern[]} The list of patterns for matching.
 * @ignore
 * @private
 */
function createPathPatterns(nglobs, basePath) {
  /**
   * List of path patterns for matching.
   * @type {PathPattern[]}
   */
  const patterns = [];

  for (const nglob of nglobs) {
    if (nglob.globPath === null) {
      // if not a glob, then match the exact path and its contents
      // by creating an absolute path glob pattern ending with '**/*'.
      // if the path to match is not a directory,
      // then the first non-glob path pattern should have matched it
      const absPath = path.resolve(basePath, nglob.path);
      patterns.push(
        {path: absPath, isGlob: false},
        {path: path.resolve(absPath, '**', '*'), isGlob: true}
      );
    } else {
      patterns.push({
        path: path.resolve(basePath, nglob.globPath),
        isGlob: true
      });
    }
  }

  return patterns;
}

/**
 * Finds the first path pattern that matches the provided path.
 * @param {string} pathToMatch The path to match.
 * @param {PathPattern[]} patterns The list of path patterns for matching.
 * @returns {PathPattern | undefined} The matched path pattern, if any.
 * @ignore
 * @private
 */
function findPathPattern(pathToMatch, patterns) {
  return patterns.find(match => {
    // match with `minimatch` for globs, otherwise match exact path
    return match.isGlob
      ? minimatch(pathToMatch, match.path, {
          dot: true,
          windowsPathsNoEscape: true
        })
      : pathToMatch === match.path;
  });
}

/**
 * Creates a match function for chokidar `ignored` option.
 * @param {PathPattern[]} allowPatterns The list of path patterns that would allow matched paths.
 * @param {PathPattern[]} ignorePatterns The list of path patterns that would ignore matched paths.
 * @param {string} basePath The path where mocha is run (e.g., current working directory).
 * @returns {chokidar.MatchFunction} The chokidar `ignored` match function.
 * @ignore
 * @private
 */
function createIgnoreMatchFunction(allowPatterns, ignorePatterns, basePath) {
  return function (filePath, stats) {
    // for some reason, chokidar calls the ignore match function twice:
    // once without `stats` and again with `stats`
    // see `ignored` under https://github.com/paulmillr/chokidar?tab=readme-ov-file#path-filtering
    // note that the second call can also have no `stats` if the `filePath` does not exist
    // in which case, allow the nonexistent path since it may be created later
    if (!stats) {
      return false;
    }

    // normalize and ensure absolute path
    filePath = path.resolve(basePath, filePath);

    /**
     * The successful match. Note that the matched pattern is not referenced
     * but including it might be useful for debugging.
     * @type {{ pattern: PathPattern; ignore: boolean; } | undefined}
     */
    let matchedBy;

    // the match check below prioritizes `watchIgnore` by processing
    // the `ignorePatterns` array first so that the `filePath` is ignored early
    for (const patterns of [ignorePatterns, allowPatterns]) {
      const pattern = findPathPattern(filePath, patterns);
      if (pattern) {
        // ignore the `filePath` if it was matched from the `ignorePatterns` array
        matchedBy = {pattern, ignore: patterns === ignorePatterns};
        break;
      }
    }

    // if a match was not found, always allow directories
    // since ignoring them will have chokidar ignore their contents
    // which we may need to watch changes for
    return matchedBy ? matchedBy.ignore : !stats.isDirectory();
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

  // glob file paths are no longer supported by chokidar since v4
  // first, strip the glob paths from `watchFiles` for chokidar to watch
  // then, create path patterns from `watchFiles` and `watchIgnore`
  // to determine if the files should be allowed or ignored
  // by the chokidar `ignored` match function

  const basePath = process.cwd();

  /**
   * List of resolved `watchFiles` without the glob part for chokidar.
   * @type {Set<string>}
   */
  const watchPaths = new Set();

  /**
   * List of path patterns for the watcher to allow to trigger test runs.
   * @type {PathPattern[]}
   */
  const allowPatterns = [];

  /**
   * List of path patterns for the watcher to ignore.
   * @type {PathPattern[]}
   */
  const ignorePatterns = [];

  for (const watchFile of watchFiles) {
    const nglobs = normalizeGlob(watchFile);
    const patterns = createPathPatterns(nglobs, basePath);
    allowPatterns.push(...patterns);

    // each path of the normalized glob would be watched by chokidar
    for (const nglob of nglobs) {
      watchPaths.add(path.resolve(basePath, nglob.path));
    }
  }

  // note: can be shortened to `flatMap()`
  for (const ignorePath of castArray(watchIgnore)) {
    const nglobs = normalizeGlob(ignorePath);
    const patterns = createPathPatterns(nglobs, basePath);
    ignorePatterns.push(...patterns);
  }

  const watcher = chokidar.watch(Array.from(watchPaths), {
    ignoreInitial: true,
    // passing an array to `ignored` with the `watchIgnore` paths
    // does not ignore files properly, so the ignore match function
    // will use the `ignorePatterns` instead to ignore these paths
    ignored: createIgnoreMatchFunction(allowPatterns, ignorePatterns, basePath)
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

  watcher.on('all', (_event, filePath) => {
    // only allow file paths that match the allowed patterns
    if (findPathPattern(filePath, allowPatterns)) {
      rerunner.scheduleRun();
    }
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
 * Object containing the path without the glob part and the full glob path, if any.
 * @private
 * @typedef {Object} NormalizedGlob
 * @property {string} path The path without the glob part.
 * @property {string | null} globPath The full glob path. If the original path was not a glob, then this is `null`.
 */

/**
 * Object for matching paths containing the absolute path which can be a glob.
 * @private
 * @typedef {Object} PathPattern
 * @property {string} path The absolute path.
 * @property {boolean} isGlob Determines if the `path` is a glob.
 */
