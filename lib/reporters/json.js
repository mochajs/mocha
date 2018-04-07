'use strict';

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @api public
 * @param {Runner} runner
 * @param {options} mocha invocation options. Invoking
 *   `mocha -R --reporter-options output-file=asdf` yields options like:
 *   { ... reporterOptions: { "output-file": "asdf" } ... }
 */
function JSONReporter (runner, options) {
  options = options || {};
  var reptOptions = options.reporterOptions || {};
  Base.call(this, runner);

  var self = this;
  var tests = [];
  var pending = [];
  var failures = [];
  var passes = [];

  runner.on('test end', function (test) {
    tests.push(test);
  });

  runner.on('pass', function (test) {
    passes.push(test);
  });

  runner.on('fail', function (test) {
    failures.push(test);
  });

  runner.on('pending', function (test) {
    pending.push(test);
  });

  runner.once('end', function () {
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };

    runner.testResults = obj;
    if ('output-object' in reptOptions) {
      // Pass to reporter with: reporter("json", {"output-object": myObject})
      Object.assign(reptOptions['output-object'], obj);
    } else {
      var text = JSON.stringify(obj, null, 2);
      if ('output-file' in reptOptions) {
        // Direct output with `mocha -R --reporter-options output-file=rpt.json`
        try {
          require('fs').writeFileSync(reptOptions['output-file'], text);
        } catch (e) {
          console.warn('error writing to ' + reptOptions.output + ':', e);
        }
      } else {
        process.stdout.write(text);
      }
    }
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {Object} test
 * @return {Object}
 */
function clean (test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: errorJSON(test.err || {})
  };
}

/**
 * Transform `error` into a JSON object.
 *
 * @api private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON (err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key];
  }, err);
  return res;
}
