var spawn = require('child_process').spawn;
var path  = require('path');
var fs = require('fs');
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
   * @param {string}   fixturePath
   * @param {array}    args
   * @param {function} fn
   */
  runMocha: function(fixturePath, args, fn) {
    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    invokeMocha(args.concat(['-C', path]), function(err, res) {
      if (err) return fn(err);

      fn(null, getSummary(res));
    });
  },

  /**
   * Invokes the mocha binary on the code of the body of the function.
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
   * @param {function} fixture
   * @param {array}    args
   * @param {function} fn
   */
  runMochaFunction: function(fixture, args, fn) {
    var path = resolveFixturePath(fixture.name + '.js' || 'tempfile.js');
    args = args || [];

    var fixtureContent = 'var fn = ' + fixture.toString() + '; fn()';
    fs.writeFileSync(path, fixtureContent, 'utf8');

    function cleanup() {
      fs.unlink(path);
      fn.apply(this, arguments);
    }

    invokeMocha(args.concat(['-C', path]), function(err, res) {
      if (err) {
        return cleanup(err);
      }

      cleanup(null, getSummary(res));
    });
  },

  /**
   * Invokes the mocha binary for the given fixture using the JSON reporter,
   * returning the parsed output, as well as exit code.
   *
   * @param {string}   fixturePath
   * @param {array}    args
   * @param {function} fn
   */
  runMochaJSON: function(fixturePath, args, fn) {
    var path;

    path = resolveFixturePath(fixturePath);
    args = args || [];

    invokeMocha(args.concat(['--reporter', 'json', path]), function(err, res) {
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
   * Returns an array of diffs corresponding to exceptions thrown from specs,
   * given the plaintext output (-C) of a mocha run.
   *
   * @param  {string}   output
   * returns {string[]}
   */
  getDiffs: function(output) {
    var diffs, i, inDiff, inStackTrace;

    diffs = [];
    output.split('\n').forEach(function(line) {
      if (line.match(/^  \d+\)/)) {
        // New spec, e.g. "1) spec title"
        diffs.push([]);
        i = diffs.length - 1;
        inStackTrace = false;
        inDiff = false;
      } else if (!diffs.length || inStackTrace) {
        // Haven't encountered a spec yet
        // or we're in the middle of a stack trace
        return;
      } else if (line.indexOf('+ expected - actual') !== -1) {
        inDiff = true;
      } else if (line.match(/at Context/)) {
        // At the start of a stack trace
        inStackTrace = true;
        inDiff = false;
      } else if (inDiff) {
        diffs[i].push(line);
      }
    });

    // Ignore empty lines before/after diff
    return diffs.map(function(diff) {
      return diff.slice(1, -3).join('\n');
    });
  },

  /**
   * regular expression used for splitting lines based on new line / dot symbol.
   */
  splitRegExp: new RegExp('[\\n' + baseReporter.symbols.dot + ']+')
};

function invokeMocha(args, fn) {
  var output, mocha, listener;

  output = '';
  args = [path.join('bin', 'mocha')].concat(args);
  mocha = spawn(process.execPath, args);

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
}

function resolveFixturePath(fixture) {
  return path.join('./test/integration/fixtures', fixture);
}

function getSummary(res) {
  return ['passing', 'pending', 'failing'].reduce(function(summary, type) {
    var pattern, match;

    pattern = new RegExp('  (\\d+) ' + type + '\\s');
    match = pattern.exec(res.output);
    summary[type] = (match) ? parseInt(match, 10) : 0;

    return summary;
  }, res);
}
