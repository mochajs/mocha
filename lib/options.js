'use strict';

var fs = require('fs');

var defaultOptionsPath = 'test/mocha.opts';

var options = Object.create(null, {
  path: {
    value: getOptionsPath
  },
  read: {
    value: readOptions
  },
  parse: {
    value: parseOptions
  },
  load: {
    value: load
  },
  defaultOptionsPath: {
    value: defaultOptionsPath
  }
});

/**
 * Export options provider.
 */
module.exports = options;

function getOptionsPath (argv, defaultOptionsPath) {
  return argv.indexOf('--opts') === -1
    ? defaultOptionsPath
    : argv[argv.indexOf('--opts') + 1];
}

function readOptions (path) {
  return fs.readFileSync(path, 'utf8');
}

function parseOptions (optsFileText) {
  return optsFileText
    .replace(/\\\s/g, '%20')
    .split(/\s/)
    .filter(Boolean)
    .map(function (value) {
      return value.replace(/%20/g, ' ');
    });
}

function load () {
  var options, optionsPath, optionsFileText;

  if (process.argv.length === 3 && (process.argv[2] === '-h' || process.argv[2] === '--help')) {
    return;
  }

  optionsPath = getOptionsPath(process.argv, defaultOptionsPath);

  try {
    optionsFileText = readOptions(optionsPath);
    options = parseOptions(optionsFileText);

    process.argv = process.argv
      .slice(0, 2)
      .concat(options, process.argv.slice(2));

    process.env.LOADED_MOCHA_OPTS = true;
  } catch (error) {
    /* ignore */
  }
}
