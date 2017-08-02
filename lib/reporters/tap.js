'use strict';

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function TAP (runner) {
  Base.call(this, runner);

  var n = 1;
  var passes = 0;
  var failures = 0;

  runner.on('start', function () {
    var total = runner.grepTotal(runner.suite);
    console.log('1..' + total);
  });

  runner.on('test', function (test) {
    console.log('# ' + title(test.parent.fullTitle()));
  });

  runner.on('test end', function () {
    ++n;
  });

  runner.on('pending', function (test) {
    console.log('ok ' + n + ' ' + title(test.title) + ' # SKIP -');
  });

  runner.on('pass', function (test) {
    passes++;
    console.log('ok ' + n + ' ' + title(test.title));
  });

  runner.on('fail', function (test, err) {
    failures++;
    console.log('not ok ' + n + ' ' + title(test.title));
    if (err.stack) {
      console.log(err.stack.replace(/^/gm, '  '));
    }
  });

  runner.on('end', function () {
    console.log('# tests ' + (passes + failures));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @api private
 * @param {Object} test
 * @return {String}
 */
function title (test) {
  return test.replace(/#/g, '');
}
