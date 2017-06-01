/**
 * Module dependencies.
 */

var Base = require('./base'),
  cursor = Base.cursor,
  color = Base.color,
  ms = require('../ms');

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONSpecReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONSpecReporter(runner) {
  Base.call(this, runner);

  // from spec.js
  var self = this,
    stats = this.stats,
    indents = 1,
    n = 0;

  // from spec.js
  function indent() {
    return Array(indents).join('  ')
  }

  var tests = [],
    failures = [],
    passes = [];

  // from spec.js
  runner.on('start', function () {
    console.warn();
  });

  // from spec.js
  runner.on('suite', function (suite) {
    ++indents;
    console.warn(color('suite', '%s%s'), indent(), suite.title);
  });

  // from spec.js
  runner.on('suite end', function (suite) {
    --indents;
    if (1 == indents) console.warn();
  });

  // from spec.js
  runner.on('pending', function (test) {
    var fmt = indent() + color('pending', '  - %s');
    console.warn(fmt, test.title);
  });

  runner.on('test end', function (test) {
    tests.push(test);
  });

  runner.on('pass', function (test) {
    passes.push(test);
    // from spec.js
    if ('fast' == test.speed) {
      var fmt = indent() + color('checkmark', '  ' + Base.symbols.ok) + color('pass', ' %s ');
      cursor.CR();
      console.warn(fmt, test.title);
    } else {
      var fmt = indent() + color('checkmark', '  ' + Base.symbols.ok) + color('pass', ' %s ') + color(test.speed, '(%dms)');
      cursor.CR();
      console.warn(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function (test) {
    failures.push(test);
    // from spec.js
    cursor.CR();
    console.warn(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', function () {
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };

    runner.testResults = obj;

    self.epilogue.call(self);

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

JSONSpecReporter.prototype.epilogue = function () {
  var stats = this.stats;
  var tests;
  var fmt;

  console.warn();

  // passes
  fmt = color('bright pass', ' ') + color('green', ' %d passing') + color('light', ' (%s)');

  console.warn(fmt,
    stats.passes || 0,
    ms(stats.duration));

  // pending
  if (stats.pending) {
    fmt = color('pending', ' ') + color('pending', ' %d pending');

    console.warn(fmt, stats.pending);
  }

  // failures
  if (stats.failures) {
    fmt = color('fail', '  %d failing');

    console.error(fmt,
      stats.failures);

    Base.list(this.failures);
    console.error();
  }

  console.warn();
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    err: errorJSON(test.err || {})
  }
}

/**
 * Transform `error` into a JSON object.
 * @param {Error} err
 * @return {Object}
 */

function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    res[key] = err[key];
  }, err);
  return res;
}
