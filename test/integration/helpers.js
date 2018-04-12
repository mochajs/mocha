'use strict';

var spawn = require('cross-spawn').spawn;
var path = require('path');
var baseReporter = require('../../lib/reporters/base');

module.exports = {
  /**
   * Invokes the mocha binary for the given fixture with color output disabled.
   * Accepts an array of additional command line args to pass. The callback is
   * invoked with a summary of the run, in addition to its output. The summary
   * includes the number of passing, pending, and failing tests, as well as the
   * exit code. Useful for testing different reporters.
   *
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
   * @param {Array<string>} args - Extra args to mocha executable
   * @param {Function} done - Callback
   */
  runMocha: function(fixturePath, args, done) {
    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    invokeMocha(args.concat(['-C', path]), function(err, res) {
      if (err) {
        return done(err);
      }

      done(null, getSummary(res));
    });
  },

  /**
   * Invokes the mocha binary for the given fixture using the JSON reporter,
   * returning the parsed output, as well as exit code.
   *
   * @param {string} fixturePath - Path from __dirname__
   * @param {string[]} args - Array of args
   * @param {Function} fn - Callback
   */
  runMochaJSON: function(fixturePath, args, fn) {
    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    return invokeMocha(args.concat(['--reporter', 'json', path]), function(
      err,
      res
    ) {
      if (err) return fn(err);

      try {
        var result = JSON.parse(res.output);
        result.code = res.code;
      } catch (err) {
        return fn(err);
      }

      fn(null, result);
    });
  },

  /**
   * regular expression used for splitting lines based on new line / dot symbol.
   */
  splitRegExp: new RegExp('[\\n' + baseReporter.symbols.dot + ']+'),

  /**
   * Invokes the mocha binary. Accepts an array of additional command line args
   * to pass. The callback is invoked with the exit code and output. Optional
   * current working directory as final parameter.
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
   * @param {string} cwd - Current working directory for mocha run, optional
   */
  invokeMocha: invokeMocha,

  /**
   * Resolves the path to a fixture to the full path.
   */
  resolveFixturePath: resolveFixturePath
};

function invokeMocha(args, fn, cwd) {
  var output, mocha, listener;

  output = '';
  args = [path.join(__dirname, '..', '..', 'bin', 'mocha')].concat(args);
  mocha = spawn(process.execPath, args, {cwd: cwd});

  listener = function(data) {
    output += data;
  };

  mocha.stdout.on('data', listener);
  mocha.stderr.on('data', listener);
  mocha.on('error', fn);

  mocha.on('close', function(code) {
    fn(null, {
      output: output.split('\n').join('\n'),
      code: code
    });
  });

  return mocha;
}

function resolveFixturePath(fixture) {
  return path.join('./test/integration/fixtures', fixture);
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
