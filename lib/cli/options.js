'use strict';

/**
 * Dependencies.
 */

var parser = require('./parser');

/**
 * Get options.
 */

exports.getOptions = function () {
  var optsPath = process.argv.indexOf('--opts') === -1
    ? 'test/mocha.opts'
    : process.argv[process.argv.indexOf('--opts') + 1];

  var opts = parser.optsArgs(optsPath);

  if (opts) {
    process.argv = process.argv
      .slice(0, 2)
      .concat(opts.concat(process.argv.slice(2)));
  }

  process.env.LOADED_MOCHA_OPTS = true;
};

exports.getArgs = function () {
  return parser.expandArgs(process.argv.slice(2));
};
