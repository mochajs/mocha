'use strict';

var format = require('util').format;
var spawn = require('cross-spawn').spawn;
var path = require('path');
var Base = require('../../lib/reporters/base');

var DEFAULT_FIXTURE = resolveFixturePath('__default__');
var MOCHA_EXECUTABLE = require.resolve('../../bin/mocha');
var _MOCHA_EXECUTABLE = require.resolve('../../bin/_mocha');

module.exports = {
  DEFAULT_FIXTURE: DEFAULT_FIXTURE,
  /**
   * Invokes the mocha binary for the given fixture with color output disabled.
   * Accepts an array of additional command line args to pass. The callback is
   * invoked with a summary of the run, in addition to its output. The summary
   * includes the number of passing, pending, and failing tests, as well as the
   * exit code. Useful for testing different reporters.
   *
   * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
   * want it.
   * Example response:
   * {
   *   pending: 0,
   *   passing: 0,
   *   failing: 1,
   *   code:    1,
   *   output:  '...'
   * }
   *
   * @param {string} fixturePath - Path to fixture .js file
   * @param {string[]} args - Extra args to mocha executable
   * @param {Function} fn - Callback
   * @param {Object} [opts] - Options for `spawn()`
   */
  runMocha: function(fixturePath, args, fn, opts) {
    if (typeof args === 'function') {
      opts = fn;
      fn = args;
      args = [];
    }

    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    invokeSubMocha(
      args.concat(['-C', path]),
      function(err, res) {
        if (err) {
          return fn(err);
        }

        fn(null, getSummary(res));
      },
      opts
    );
  },

  /**
   * Invokes the mocha binary for the given fixture using the JSON reporter,
   * returning the parsed output, as well as exit code.
   *
   * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
   * want it.
   * @param {string} fixturePath - Path from __dirname__
   * @param {string[]} args - Array of args
   * @param {Function} fn - Callback
   * @param {Object} [opts] - Opts for `spawn()`
   * @returns {*} Parsed object
   */
  runMochaJSON: function(fixturePath, args, fn, opts) {
    if (typeof args === 'function') {
      opts = fn;
      fn = args;
      args = [];
    }

    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    return invokeMocha(
      args.concat(['--reporter', 'json', path]),
      function(err, res) {
        if (err) return fn(err);

        try {
          var result = toJSONRunResult(res);
          fn(null, result);
        } catch (err) {
          fn(
            new Error(
              format(
                'Failed to parse JSON reporter output.\nArgs: %O\nResult:\n\n%O',
                args,
                res
              )
            )
          );
        }
      },
      opts
    );
  },
  /**
   * Invokes the mocha binary for the given fixture using the JSON reporter,
   * returning the **raw** string output, as well as exit code.
   *
   * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
   * want it.
   * @param {string} fixturePath - Path from __dirname__
   * @param {string[]} args - Array of args
   * @param {Function} fn - Callback
   * @param {Object} [opts] - Opts for `spawn()`
   * @returns {string} Raw output
   */
  runMochaJSONRaw: function(fixturePath, args, fn, opts) {
    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    return invokeSubMocha(
      args.concat(['--reporter', 'json', path]),
      function(err, resRaw) {
        if (err) return fn(err);

        fn(null, resRaw);
      },
      opts
    );
  },

  /**
   * regular expression used for splitting lines based on new line / dot symbol.
   */
  splitRegExp: new RegExp('[\\n' + Base.symbols.dot + ']+'),

  /**
   * Invokes the mocha binary. Accepts an array of additional command line args
   * to pass. The callback is invoked with the exit code and output. Optional
   * current working directory as final parameter.
   *
   * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
   * want it.
   *
   * In most cases runMocha should be used instead.
   *
   * Example response:
   * {
   *   code:    1,
   *   output:  '...'
   * }
   *
   * @param {Array<string>} args - Extra args to mocha executable
   * @param {Function} done - Callback
   * @param {Object} [opts] - Options for `spawn()`
   */
  invokeMocha: invokeMocha,

  /**
   * Resolves the path to a fixture to the full path.
   */
  resolveFixturePath: resolveFixturePath,

  toJSONRunResult: toJSONRunResult
};

/**
 * Coerce output as returned by _spawnMochaWithListeners using JSON reporter into a JSONRunResult as
 * recognized by our custom unexpected assertions
 * @param {string} result - Raw stdout from Mocha run using JSON reporter
 * @private
 */
function toJSONRunResult(result) {
  var code = result.code;
  result = JSON.parse(result.output);
  result.code = code;
  return result;
}

/**
 * Creates arguments loading a default fixture if none provided
 *
 * @param {string[]|*} [args] - Arguments to `spawn`
 * @returns string[]
 */
function defaultArgs(args) {
  return !args || !args.length ? ['--file', DEFAULT_FIXTURE] : args;
}

function invokeMocha(args, fn, opts) {
  if (typeof args === 'function') {
    opts = fn;
    fn = args;
    args = [];
  }
  return _spawnMochaWithListeners(
    defaultArgs([MOCHA_EXECUTABLE].concat(args)),
    fn,
    opts
  );
}

function invokeSubMocha(args, fn, opts) {
  if (typeof args === 'function') {
    opts = fn;
    fn = args;
    args = [];
  }
  return _spawnMochaWithListeners(
    defaultArgs([_MOCHA_EXECUTABLE].concat(args)),
    fn,
    opts
  );
}

/**
 * Spawns Mocha in a subprocess and returns an object containing its output and exit code
 *
 * @param {string[]} args - Path to executable and arguments
 * @param {Function} fn - Callback
 * @param {Object|string} [opts] - Options to `cross-spawn`, or 'pipe' for shortcut to `{stdio: pipe}`
 * @returns {ChildProcess}
 * @private
 */
function _spawnMochaWithListeners(args, fn, opts) {
  var output = '';
  if (opts === 'pipe') {
    opts = {stdio: 'pipe'};
  }
  opts = Object.assign(
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore']
    },
    opts || {}
  );
  var mocha = spawn(process.execPath, args, opts);
  var listener = function(data) {
    output += data;
  };

  mocha.stdout.on('data', listener);
  if (mocha.stderr) {
    mocha.stderr.on('data', listener);
  }
  mocha.on('error', fn);

  mocha.on('close', function(code) {
    fn(null, {
      output: output.split('\n').join('\n'),
      code: code,
      args: args
    });
  });

  return mocha;
}

function resolveFixturePath(fixture) {
  if (path.extname(fixture) !== '.js') {
    fixture += '.fixture.js';
  }
  return path.join('test', 'integration', 'fixtures', fixture);
}

function getSummary(res) {
  return ['passing', 'pending', 'failing'].reduce(function(summary, type) {
    var pattern, match;

    pattern = new RegExp('  (\\d+) ' + type + '\\s');
    match = pattern.exec(res.output);
    summary[type] = match ? parseInt(match, 10) : 0;

    return summary;
  }, res);
}
