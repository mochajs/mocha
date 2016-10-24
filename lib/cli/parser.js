'use strict';

var fs = require('fs');

/**
 * expands a mocha.opts file into args
 * @param {string} optsPath
 * @return {string[]|null} args
 */
exports.optsArgs = function (optsPath) {
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
 * modifies process.argv by calling parser.optsArgs
 * and expanding the --opts parameter into process.argv
 *
 * @param {?string[]} argv arguments or uses process.argv as default (is mutated)
 * @return {string[]} argv after manipulation (even though argv is mutated)
 */
exports.expandOpts = function (argv) {
  argv = argv || process.argv;

  var optsPath = argv.indexOf('--opts') === -1
    ? 'test/mocha.opts'
    : argv[argv.indexOf('--opts') + 1];

  var opts = exports.optsArgs(optsPath);

  if (opts) {
    var temp = argv
      .slice(0, 2)
      .concat(opts.concat(argv.slice(2)));

    // empties and replaces array in place, effectively mutating argv
    argv.length = 0;
    argv.push.apply(argv, temp);
  }

  process.env.LOADED_MOCHA_OPTS = true;

  return argv;
};
