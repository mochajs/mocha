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
 * Get options.
 */

function getOptions() {
  if (
    process.argv.length === 3 &&
    (process.argv[2] === '-h' || process.argv[2] === '--help')
  ) {
    return;
  }

  const optPathSpecified = process.argv.indexOf('--opts') > -1;
  const optsPath = optPathSpecified
    ? process.argv[process.argv.indexOf('--opts') + 1]
    : 'test/mocha.opts';

  if (optPathSpecified && !fs.existsSync(optsPath)) {
    const noSuchFileError = new Error(
      `Specified options file does not exist: ${optsPath}`
    );
    noSuchFileError.code = 'ENOENT';
    throw noSuchFileError;
  }

  try {
    const opts = fs
      .readFileSync(optsPath, 'utf8')
      .replace(/^#.*$/gm, '')
      .replace(/\\\s/g, '%20')
      .split(/\s/)
      .filter(Boolean)
      .map(value => value.replace(/%20/g, ' '));

    process.argv = process.argv
      .slice(0, 2)
      .concat(opts.concat(process.argv.slice(2)));
  } catch (ignore) {
    // NOTE: should console.error() and throw the error
  }

  process.env.LOADED_MOCHA_OPTS = 'true';
}
