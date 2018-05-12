'use strict';

/**
 * Dependencies.
 */

const fs = require('fs');
const path = require('path');

/**
 * Export `getOptions`.
 */

module.exports = getOptions;

/**
 * Default test directory.
 *
 * @constant
 * @type {string}
 * @default
 */
const DEFAULT_TEST_DIRECTORY = 'test';

/**
 * Default filename of run-control file.
 *
 * @constant
 * @type {string}
 * @default
 */
const DEFAULT_OPTS_FILENAME = 'mocha.opts';

/**
 * Reads contents of the run-control file.
 *
 * @private
 * @param {string} pathname - Pathname of run-control file.
 * @returns {string} file contents
 */
function readOptionsFile(pathname) {
  return fs.readFileSync(pathname, 'utf8');
}

/**
 * Parses options read from run-control file.
 *
 * @private
 * @param {string} content - Content read from run-control file.
 * @returns {string[]} cmdline options (and associated arguments)
 */
function parseOptions(content) {
  /*
   * Replaces comments with empty strings
   * Replaces escaped spaces (e.g., 'xxx\ yyy') with HTML space
   * Splits on whitespace, creating array of substrings
   * Filters empty string elements from array
   * Replaces any HTML space with space
   */
  return content
    .replace(/^#.*$/gm, '')
    .replace(/\\\s/g, '%20')
    .split(/\s/)
    .filter(Boolean)
    .map(value => value.replace(/%20/g, ' '));
}

/**
 * Prepends options from run-control file to the command line arguments.
 *
 * @public
 * @see {@link https://mochajs.org/#mochaopts|mocha.opts}
 */
function getOptions() {
  if (
    process.argv.length === 3 &&
    (process.argv[2] === '-h' || process.argv[2] === '--help')
  ) {
    return;
  }

  const optsIndex = process.argv.indexOf('--opts');
  const optsPathSpecified = optsIndex !== -1;
  const defaultOptsPath = path.join(
    DEFAULT_TEST_DIRECTORY,
    DEFAULT_OPTS_FILENAME
  );
  const optsPath = optsPathSpecified
    ? process.argv[optsIndex + 1]
    : defaultOptsPath;

  try {
    const opts = parseOptions(readOptionsFile(optsPath));

    if (opts.length > 0) {
    process.argv = process.argv
      .slice(0, 2)
      .concat(opts.concat(process.argv.slice(2)));
    }
  } catch (err) {
    // Default options file may not exist - rethrow anything else
    if (optsPathSpecified || err.code !== 'ENOENT') {
      console.error(`failed to load Mocha options file: ${optsPath}`);
      throw err;
    }
  } finally {
    // Despite its name, signifies loading was attempted and should not be again
    process.env.LOADED_MOCHA_OPTS = '1';
  }
}
