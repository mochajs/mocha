'use strict';

const logSymbols = require('log-symbols');
const debug = require('debug')('mocha:cli:watch');
const path = require('node:path');
const chokidar = require('chokidar');
const glob = require('glob');
const isPathInside = require('is-path-inside');
const {minimatch} = require('minimatch');
const Context = require('../context');
const collectFiles = require('./collect-files');

/**
 * @typedef {import('chokidar').FSWatcher} FSWatcher
 * @typedef {import('glob').Glob['patterns'][number]} Pattern
 * The `Pattern` class is not exported by the `glob` package.
 * Ref [link](../../node_modules/glob/dist/commonjs/pattern.d.ts).
 * @typedef {import('../mocha.js')} Mocha
 * @typedef {import('../types.d.ts').BeforeWatchRun} BeforeWatchRun
 * @typedef {import('../types.d.ts').FileCollectionOptions} FileCollectionOptions
 * @typedef {import('../types.d.ts').Rerunner} Rerunner
 * @typedef {import('../types.d.ts').PathPattern} PathPattern
 * @typedef {import('../types.d.ts').PathFilter} PathFilter
 * @typedef {import('../types.d.ts').PathMatcher} PathMatcher
 */

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
 * Extracts out paths without the glob part, the directory paths,
 * and the paths for matching from the provided glob paths.
 * @param {string[]} globPaths The list of glob paths to create a filter for.
 * @param {string} basePath The path where mocha is run (e.g., current working directory).
 * @returns {PathFilter} Object to filter paths.
 * @ignore
 * @private
 */
function createPathFilter(globPaths, basePath) {
  debug('creating path filter from glob paths: %s', globPaths);

  /**
   * The resulting object to filter paths.
   * @type {PathFilter}
   */
  const res = {
    dir: {paths: new Set(), globs: new Set()},
    match: {paths: new Set(), globs: new Set()}
  };

  // for checking if a path ends with `/**/*`
  const globEnd = path.join(path.sep, '**', '*');

  /**
   * The current glob pattern to check.
   * @type {Pattern[]}
   */
  const patterns = globPaths.flatMap(globPath => {
    return new glob.Glob(globPath, {
      dot: true,
      magicalBraces: true,
      windowsPathsNoEscape: true
    }).patterns;
  }, []);

  // each pattern will have its own path because of the `magicalBraces` option
  for (const pattern of patterns) {
    debug('processing glob pattern: %s', pattern.globString());

    /**
     * Path segments before the glob pattern.
     * @type {string[]}
     */
    const segments = [];

    /**
     * The current glob pattern to check.
     * @type {Pattern | null}
     */
    let currentPattern = pattern;
    let isGlob = false;

    do {
      // save string patterns until a non-string (glob or regexp) is matched
      const entry = currentPattern.pattern();
      const isString = typeof entry === 'string';
      debug(
        'found %s pattern: %s',
        isString ? 'string' : 'glob or regexp',
        entry
      );
      if (!isString) {
        // if the entry is a glob
        isGlob = true;
        break;
      }

      segments.push(entry);

      // go to next pattern
    } while ((currentPattern = currentPattern.rest()));
    if (!isGlob) {
      debug('all subpatterns of %j processed', pattern.globString());
    }

    // match `cleanPath` (path without the glob part) and its subdirectories
    const cleanPath = path.resolve(basePath, ...segments);
    debug('clean path: %s', cleanPath);
    res.dir.paths.add(cleanPath);
    res.dir.globs.add(path.resolve(cleanPath, '**', '*'));

    // match `absPath` and all of its contents
    const absPath = path.resolve(basePath, pattern.globString());
    debug('absolute path: %s', absPath);
    (isGlob ? res.match.globs : res.match.paths).add(absPath);

    // always include `/**/*` to the full pattern for matching
    // since it's possible for the last path segment to be a directory
    if (!absPath.endsWith(globEnd)) {
      res.match.globs.add(path.resolve(absPath, '**', '*'));
    }
  }

  debug('returning path filter: %o', res);
  return res;
}

/**
 * Checks if the provided path matches with the path pattern.
 * @param {string} filePath The path to match.
 * @param {PathPattern} pattern The path pattern for matching.
 * @param {boolean} [matchParent] Treats the provided path as a match if it's a valid parent directory from the list of paths.
 * @returns {boolean} Determines if the provided path matches the pattern.
 * @ignore
 * @private
 */
function matchPattern(filePath, pattern, matchParent) {
  if (pattern.paths.has(filePath)) {
    return true;
  }

  if (matchParent) {
    for (const childPath of pattern.paths) {
      if (isPathInside(childPath, filePath)) {
        return true;
      }
    }
  }

  // loop through the set of glob paths instead of converting it into an array
  for (const globPath of pattern.globs) {
    if (
      minimatch(filePath, globPath, {dot: true, windowsPathsNoEscape: true})
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Creates an object for matching allowed or ignored file paths.
 * @param {PathFilter} allowed The filter for allowed paths.
 * @param {PathFilter} ignored The filter for ignored paths.
 * @param {string} basePath The path where mocha is run (e.g., current working directory).
 * @returns {PathMatcher} The object for matching paths.
 * @ignore
 * @private
 */
function createPathMatcher(allowed, ignored, basePath) {
  debug(
    'creating path matcher from allowed: %o, ignored: %o',
    allowed,
    ignored
  );

  /**
   * Cache of known file paths processed by `matcher.allow()`.
   * @type {Map<string, boolean>}
   */
  const allowCache = new Map();

  /**
   * Cache of known file paths processed by `matcher.ignore()`.
   * @type {Map<string, boolean>}
   */
  const ignoreCache = new Map();

  const MAX_CACHE_SIZE = 10000;

  /**
   * Performs a `map.set()` but will delete the first key
   * for new key-value pairs whenever the limit is reached.
   * @param {Map<string, boolean>} map The map to use.
   * @param {string} key The key to use.
   * @param {boolean} value The value to set.
   */
  function cache(map, key, value) {
    // only delete the first key if the key doesn't exist in the map
    if (map.size >= MAX_CACHE_SIZE && !map.has(key)) {
      map.delete(map.keys().next().value);
    }
    map.set(key, value);
  }

  /**
   * @type {PathMatcher}
   */
  const matcher = {
    allow(filePath) {
      let allow = allowCache.get(filePath);
      if (allow !== undefined) {
        return allow;
      }

      allow = matchPattern(filePath, allowed.match);
      cache(allowCache, filePath, allow);
      return allow;
    },

    ignore(filePath, stats) {
      // Chokidar calls the ignore match function twice:
      // once without `stats` and again with `stats`
      // see `ignored` under https://github.com/paulmillr/chokidar?tab=readme-ov-file#path-filtering
      // note that the second call can also have no `stats` if the `filePath` does not exist
      // in which case, allow the nonexistent path since it may be created later
      if (!stats) {
        return false;
      }

      // resolve to ensure correct absolute path since, for some reason,
      // Chokidar paths for the ignore match function use slashes `/` even for Windows
      filePath = path.resolve(basePath, filePath);

      let ignore = ignoreCache.get(filePath);
      if (ignore !== undefined) {
        return ignore;
      }

      // `filePath` ignore conditions:
      // - check if it's ignored from the `ignored` path patterns
      // - otherwise, check if it's not ignored via `matcher.allow()` to also cache the result
      // - if no match was found and `filePath` is a directory,
      // check from the allowed directory paths if it's a valid
      // parent directory or if it matches any of the allowed patterns
      // since ignoring directories will have Chokidar ignore their contents
      // which we may need to watch changes for
      ignore =
        matchPattern(filePath, ignored.match) ||
        (!matcher.allow(filePath) &&
          (!stats.isDirectory() || !matchPattern(filePath, allowed.dir, true)));

      cache(ignoreCache, filePath, ignore);
      return ignore;
    }
  };

  return matcher;
}

/**
 * Bootstraps a Chokidar watcher. Handles keyboard input & signals
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

  debug('watching files: %s', watchFiles);
  debug('ignoring files matching: %s', watchIgnore);
  let globalFixtureContext;

  // we handle global fixtures manually
  mocha.enableGlobalSetup(false).enableGlobalTeardown(false);

  // glob file paths are no longer supported by Chokidar since v4
  // first, strip the glob paths from `watchFiles` for Chokidar to watch
  // then, create path patterns from `watchFiles` and `watchIgnore`
  // to determine if the files should be allowed or ignored
  // by the Chokidar `ignored` match function

  const basePath = process.cwd();
  const allowed = createPathFilter(watchFiles, basePath);
  const ignored = createPathFilter(watchIgnore, basePath);
  const matcher = createPathMatcher(allowed, ignored, basePath);

  // Chokidar has to watch the directory paths in case new files are created
  const watcher = chokidar.watch(Array.from(allowed.dir.paths), {
    ignoreInitial: true,
    ignored: matcher.ignore
  });

  const rerunner = createRerunner(mocha, watcher, {
    beforeRun
  });

  watcher.on('ready', async () => {
    debug('watcher ready');
    if (!globalFixtureContext) {
      debug('triggering global setup');
      globalFixtureContext = await mocha.runGlobalSetup();
    }
    rerunner.run();
  });

  watcher.on('all', (_event, filePath) => {
    // only allow file paths that match the allowed patterns
    if (matcher.allow(filePath)) {
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
 * @param {FSWatcher} watcher - Chokidar `FSWatcher` instance
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
    } catch (err) {
      console.error(err.stack);
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
 * Return the list of absolute paths watched by a Chokidar watcher.
 *
 * @param watcher - Instance of a Chokidar watcher
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
 * @param {FSWatcher} watcher - Chokidar FSWatcher
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
