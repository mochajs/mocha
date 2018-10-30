'use strict';

/**
 * Dependencies.
 */

const fs = require('fs');

/**
 * Export `getOptions`.
 */

module.exports = getOptions;

/**
 * Default pathname for run-control file.
 *
 * @constant
 * @type {string}
 * @default
 */
const defaultPathname = 'test/mocha.opts';

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

  const optsPath =
    process.argv.indexOf('--opts') === -1
      ? defaultPathname
      : process.argv[process.argv.indexOf('--opts') + 1];

  try {
    const opts = parseOptions(readOptionsFile(optsPath));

    process.argv = process.argv
      .slice(0, 2)
      .concat(opts.concat(process.argv.slice(2)));
  } catch (ignore) {
    // NOTE: should console.error() and throw the error
  }

  process.env.LOADED_MOCHA_OPTS = true;
}
