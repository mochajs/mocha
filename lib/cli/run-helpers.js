'use strict';

/**
 * Helper scripts for the `run` command
 * @see module:lib/cli/run
 * @module
 * @private
 */

const fs = require('fs');
const path = require('path');
const debug = require('debug')('mocha:cli:run:helpers');
const watchRun = require('./watch-run');
const collectFiles = require('./collect-files');

const cwd = (exports.cwd = process.cwd());

exports.watchRun = watchRun;

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
 * Collect test files and run mocha instance.
 * @param {Mocha} mocha - Mocha instance
 * @param {Options} [opts] - Command line options
 * @param {boolean} [opts.exit] - Whether or not to force-exit after tests are complete
 * @param {Object} fileCollectParams - Parameters that control test
 *   file collection. See `lib/cli/collect-files.js`.
 * @returns {Runner}
 * @private
 */
exports.singleRun = (mocha, {exit}, fileCollectParams) => {
  const files = collectFiles(fileCollectParams);
  debug('running tests with files', files);
  mocha.files = files;
  return mocha.run(exit ? exitMocha : exitMochaLater);
};

/**
 * Actually run tests
 * @param {Mocha} mocha - Mocha instance
 * @param {Object} opts - Command line options
 * @private
 */
exports.runMocha = (mocha, options) => {
  const {
    watch = false,
    extension = [],
    exit = false,
    ignore = [],
    file = [],
    recursive = false,
    sort = false,
    spec = [],
    watchFiles,
    watchIgnore
  } = options;

  const fileCollectParams = {
    ignore,
    extension,
    file,
    recursive,
    sort,
    spec
  };

  if (watch) {
    watchRun(mocha, {watchFiles, watchIgnore}, fileCollectParams);
  } else {
    exports.singleRun(mocha, {exit}, fileCollectParams);
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
