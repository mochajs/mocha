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
 * Get options.
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
  const defaultOptsPath = path.join('test', 'mocha.opts');
  const optsPath = optsPathSpecified
    ? process.argv[optsIndex + 1]
    : defaultOptsPath;

  try {
    const opts = fs
      .readFileSync(optsPath, 'utf8')
      .replace(/^#.*$/gm, '')
      .replace(/\\\s/g, '%20')
      .split(/\s/)
      .filter(Boolean)
      .map(value => value.replace(/%20/g, ' '));

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
