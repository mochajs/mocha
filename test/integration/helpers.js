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
   * includes the number of passing, pending, skipped and failing tests, as well
   * as the exit code. Useful for testing different reporters.
   *
   * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
   * want it.
   * Example response:
   * {
   *   passing: 0,
   *   pending: 0,
   *   skipped: 0,
   *   failing: 1,
   *   code:    1,
   *   output:  '...'
   * }
   *
   * @param {string} fixturePath - Path to fixture .js file
   * @param {string[]} args - Extra args to mocha executable
   * @param {Function} fn - Callback
   * @param {Object} [opts] - Options for `spawn()`
   * @returns {ChildProcess} Mocha process
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

    return invokeSubMocha(
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
    args = (args || []).concat('--reporter', 'json', path);

    return invokeMocha(
      args,
      function(err, res) {
        if (err) {
          return fn(err);
        }

        var result;
        try {
          // attempt to catch a JSON parsing error *only* here.
          // previously, the callback was called within this `try` block,
          // which would result in errors thrown from the callback
          // getting caught by the `catch` block below.
          result = toJSONRunResult(res);
        } catch (err) {
          return fn(
            new Error(
              format(
                'Failed to parse JSON reporter output. Error:\n%O\nResult:\n%O',
                err,
                res
              )
            )
          );
        }
        fn(null, result);
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

  invokeMochaAsync: invokeMochaAsync,

  invokeNode: invokeNode,

  /**
   * Resolves the path to a fixture to the full path.
   */
  resolveFixturePath: resolveFixturePath,

  toJSONRunResult: toJSONRunResult,

  /**
   * Given a regexp-like string, escape it so it can be used with the `RegExp` constructor
   * @param {string} str - string to be escaped
   * @returns {string} Escaped string
   */
  escapeRegExp: function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
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

/**
 * Invokes the mocha binary with the given arguments. Returns the
 * child process and a promise for the results of running the
 * command. The promise resolves when the child process exits. The
 * result includes the **raw** string output, as well as exit code.
 *
 * By default, `STDERR` is ignored. Pass `{stdio: 'pipe'}` as `opts` if you
 * want it as part of the result output.
 *
 * @param {string[]} args - Array of args
 * @param {Object} [opts] - Opts for `spawn()`
 * @returns {[ChildProcess|Promise<Result>]}
 */
function invokeMochaAsync(args, opts) {
  let mochaProcess;
  const resultPromise = new Promise((resolve, reject) => {
    mochaProcess = _spawnMochaWithListeners(
      defaultArgs([MOCHA_EXECUTABLE].concat(args)),
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
      opts
    );
  });
  return [mochaProcess, resultPromise];
}

/**
 * Invokes Node without Mocha binary with the given arguments,
 * when Mocha is used programmatically.
 */
function invokeNode(args, fn, opts) {
  if (typeof args === 'function') {
    opts = fn;
    fn = args;
    args = [];
  }
  return _spawnMochaWithListeners(args, fn, opts);
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
      output: output,
      code: code,
      args: args
    });
  });

  return mocha;
}

function resolveFixturePath(fixture) {
  if (path.extname(fixture) !== '.js' && path.extname(fixture) !== '.mjs') {
    fixture += '.fixture.js';
  }
  return path.join('test', 'integration', 'fixtures', fixture);
}

function getSummary(res) {
  return ['passing', 'pending', 'skipped', 'failing'].reduce(function(
    summary,
    type
  ) {
    var pattern, match;

    pattern = new RegExp('  (\\d+) (?:/ \\d+ )?' + type + '\\s');
    match = pattern.exec(res.output);
    summary[type] = match ? parseInt(match, 10) : 0;

    return summary;
  },
  res);
}
