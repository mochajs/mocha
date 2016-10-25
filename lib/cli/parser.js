'use strict';

var fs = require('fs');

/**
 * expands a mocha.opts file into args
 * @param {string} optsPath
 * @return {string[]|null} args
 */
exports.optsFile = function (optsPath) {
  optsPath = optsPath || 'test/mocha.opts';

  try {
    return fs.readFileSync(optsPath, 'utf8')
      .replace(/\\\s/g, '%20')
      .split(/\s/)
      .filter(Boolean)
      .map(function (value) {
        return value.replace(/%20/g, ' ');
      });
  } catch (err) {
    // ignore
  }

  return null;
};

/**
 * expands cli arguments, and sets additional option defaults.
 * @param {string[]} args cli arguments
 */
exports.expandArgs = function (args) {
  var expandedArgs = [];

  args.forEach(function (arg) {
    exports.expandArg(arg, expandedArgs);
  });

  return expandedArgs;
};

/**
 * expands an argument into an array
 * @param {string} arg
 * @param {string[]} args array reference to add args too
 */
exports.expandArg = function (arg, args) {
  var flag = arg.split('=')[0];

  switch (flag) {
    case '-d':
      args.unshift('--debug');
      args.push('--no-timeouts');
      break;
    case 'debug':
    case '--debug':
    case '--debug-brk':
    case '--inspect':
      args.unshift(arg);
      args.push('--no-timeouts');
      break;
    case '-gc':
    case '--expose-gc':
      args.unshift('--expose-gc');
      break;
    case '--gc-global':
    case '--es_staging':
    case '--no-deprecation':
    case '--prof':
    case '--log-timer-events':
    case '--throw-deprecation':
    case '--trace-deprecation':
    case '--use_strict':
    case '--allow-natives-syntax':
    case '--perf-basic-prof':
      args.unshift(arg);
      break;
    default:
      if (arg.indexOf('--harmony') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--trace') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--icu-data-dir') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--max-old-space-size') === 0) {
        args.unshift(arg);
      } else if (arg.indexOf('--preserve-symlinks') === 0) {
        args.unshift(arg);
      } else {
        args.push(arg);
      }
      break;
  }
};

/**
 * expands the --opts parameter into args and returns new args after manipulation
 *
 * @param {?string[]} args arguments or uses process.argv.slice(2) as default
 * @return {string[]} args after manipulation
 */
exports.expandOpts = function (args) {
  args = args || process.argv.slice(2);

  var optsPath = args.indexOf('--opts') === -1
    ? 'test/mocha.opts'
    : args[args.indexOf('--opts') + 1];

  var opts = exports.optsFile(optsPath);

  if (opts) {
    return opts.concat(args);
  }

  return args;
};
