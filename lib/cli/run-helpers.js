'use strict';

/**
 * Helper scripts for the `run` command
 * @see module:lib/cli/run
 * @module
 * @private
 */

const fs = require('fs');
const path = require('path');
const ansi = require('ansi-colors');
const debug = require('debug')('mocha:cli:run:helpers');
const minimatch = require('minimatch');
const Context = require('../context');
const Mocha = require('../mocha');
const utils = require('../utils');

const cwd = (exports.cwd = process.cwd());

/**
 * Exits Mocha when tests + code under test has finished execution (default)
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
const exitMochaLater = code => {
  process.on('exit', () => {
    process.exitCode = Math.min(code, 255);
  });
};

/**
 * Exits Mocha when Mocha itself has finished execution, regardless of
 * what the tests or code under test is doing.
 * @param {number} code - Exit code; typically # of failures
 * @ignore
 * @private
 */
const exitMocha = code => {
  const clampedCode = Math.min(code, 255);
  let draining = 0;

  // Eagerly set the process's exit code in case stream.write doesn't
  // execute its callback before the process terminates.
  process.exitCode = clampedCode;

  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  const done = () => {
    if (!draining--) {
      process.exit(clampedCode);
    }
  };

  const streams = [process.stdout, process.stderr];

  streams.forEach(stream => {
    // submit empty write request and wait for completion
    draining += 1;
    stream.write('', done);
  });

  done();
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
 * Stop cursor business
 * @private
 */
const stop = () => {
  process.stdout.write('\u001b[2K');
};

/**
 * Coerce a comma-delimited string (or array thereof) into a flattened array of
 * strings
 * @param {string|string[]} str - Value to coerce
 * @returns {string[]} Array of strings
 * @private
 */
exports.list = str =>
  Array.isArray(str) ? exports.list(str.join(',')) : str.split(/ *, */);

/**
 * `require()` the modules as required by `--require <require>`
 * @param {string[]} requires - Modules to require
 * @private
 */
exports.handleRequires = (requires = []) => {
  requires.forEach(mod => {
    let modpath = mod;
    if (fs.existsSync(mod, {cwd}) || fs.existsSync(`${mod}.js`, {cwd})) {
      modpath = path.resolve(mod);
      debug(`resolved ${mod} to ${modpath}`);
    }
    require(modpath);
    debug(`loaded require "${mod}"`);
  });
};

/**
 * Smash together an array of test files in the correct order
 * @param {Object} [opts] - Options
 * @param {string[]} [opts.extension] - File extensions to use
 * @param {string[]} [opts.spec] - Files, dirs, globs to run
 * @param {string[]} [opts.exclude] - Files, dirs, globs to exclude
 * @param {boolean} [opts.recursive=false] - Find files recursively
 * @param {boolean} [opts.sort=false] - Sort test files
 * @returns {string[]} List of files to test
 * @private
 */
exports.handleFiles = ({
  exclude = [],
  extension = [],
  file = [],
  recursive = false,
  sort = false,
  spec = []
} = {}) => {
  let files = [];
  const unmatched = [];
  spec.forEach(arg => {
    let newFiles;
    try {
      newFiles = utils.lookupFiles(arg, extension, recursive);
    } catch (err) {
      if (err.code === 'ERR_MOCHA_NO_FILES_MATCH_PATTERN') {
        unmatched.push({message: err.message, pattern: err.pattern});
        return;
      }

      throw err;
    }

    if (typeof newFiles !== 'undefined') {
      if (typeof newFiles === 'string') {
        newFiles = [newFiles];
      }
      newFiles = newFiles.filter(fileName =>
        exclude.every(pattern => !minimatch(fileName, pattern))
      );
    }

    files = files.concat(newFiles);
  });

  if (!files.length) {
    // give full message details when only 1 file is missing
    const noneFoundMsg =
      unmatched.length === 1
        ? `Error: No test files found: ${JSON.stringify(unmatched[0].pattern)}` // stringify to print escaped characters raw
        : 'Error: No test files found';
    console.error(ansi.red(noneFoundMsg));
    process.exit(1);
  } else {
    // print messages as an warning
    unmatched.forEach(warning => {
      console.warn(ansi.yellow(`Warning: ${warning.message}`));
    });
  }

  const fileArgs = file.map(filepath => path.resolve(filepath));
  files = files.map(filepath => path.resolve(filepath));

  // ensure we don't sort the stuff from fileArgs; order is important!
  if (sort) {
    files.sort();
  }

  // add files given through --file to be ran first
  files = fileArgs.concat(files);
  debug('files (in order): ', files);
  return files;
};

/**
 * Give Mocha files and tell it to run
 * @param {Mocha} mocha - Mocha instance
 * @param {Options} [opts] - Options
 * @param {string[]} [opts.files] - List of test files
 * @param {boolean} [opts.exit] - Whether or not to force-exit after tests are complete
 * @returns {Runner}
 * @private
 */
exports.singleRun = (mocha, {files = [], exit = false} = {}) => {
  mocha.files = files;
  return mocha.run(exit ? exitMocha : exitMochaLater);
};

/**
 * Run Mocha in "watch" mode
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} [opts] - Options
 * @param {string[]} [opts.extension] - List of extensions to watch
 * @param {string|RegExp} [opts.grep] - Grep for test titles
 * @param {string} [opts.ui=bdd] - User interface
 * @param {string[]} [files] - Array of test files
 * @private
 */
exports.watchRun = (
  mocha,
  {extension = ['js'], grep = '', ui = 'bdd', files = []} = {}
) => {
  let runner;

  console.log();
  hideCursor();
  process.on('SIGINT', () => {
    showCursor();
    console.log('\n');
    process.exit(130);
  });

  const watchFiles = utils.files(cwd, extension);
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
    stop();
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
 * Actually run tests
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.watch=false] - Enable watch mode
 * @param {string[]} [opts.extension] - List of extensions to watch
 * @param {string|RegExp} [opts.grep] - Grep for test titles
 * @param {string} [opts.ui=bdd] - User interface
 * @param {boolean} [opts.exit=false] - Force-exit Mocha when tests done
 * @param {string[]} [files] - Array of test files
 * @private
 */
exports.runMocha = (
  mocha,
  {watch = false, extension = ['js'], grep = '', ui = 'bdd', exit = false} = {},
  files = []
) => {
  if (watch) {
    exports.watchRun(mocha, {extension, grep, ui, files});
  } else {
    exports.singleRun(mocha, {files, exit});
  }
};

/**
 * Used for `--reporter` and `--ui`.  Ensures there's only one, and asserts
 * that it actually exists.
 * @todo XXX This must get run after requires are processed, as it'll prevent
 * interfaces from loading.
 * @param {Object} opts - Options object
 * @param {string} key - Resolvable module name or path
 * @param {Object} [map] - An object perhaps having key `key`
 * @private
 */
exports.validatePlugin = (opts, key, map = {}) => {
  if (Array.isArray(opts[key])) {
    throw new TypeError(`"--${key} <${key}>" can only be specified once`);
  }

  const unknownError = () => new Error(`Unknown "${key}": ${opts[key]}`);

  if (!map[opts[key]]) {
    try {
      opts[key] = require(opts[key]);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        // Try to load reporters from a path (absolute or relative)
        try {
          opts[key] = require(path.resolve(process.cwd(), opts[key]));
        } catch (err) {
          throw unknownError();
        }
      } else {
        throw unknownError();
      }
    }
  }
};
