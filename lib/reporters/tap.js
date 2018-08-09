'use strict';
/**
 * @module TAP
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function TAP(runner) {
  Base.call(this, runner);

  var self = this;
  var n = 1;
  var passes = 0;
  var failures = 0;

  runner.on('start', function() {
    console.log('TAP version 13');
    var total = runner.grepTotal(runner.suite);
    console.log('%d..%d', 1, total);
  });

  runner.on('test end', function() {
    ++n;
  });

  runner.on('pending', function(test) {
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test) {
    passes++;
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err) {
    failures++;
    console.log('not ok %d %s', n, title(test));
    var emitYamlBlock = err.message != null || err.stack != null;
    if (emitYamlBlock) {
      console.log('  ---');
      if (err.message) {
        console.log('    message: |-');
        console.log(err.message.replace(/^/gm, '      '));
      }
      if (err.stack) {
        console.log('    stack: |-');
        console.log(err.stack.replace(/^/gm, '      '));
      }
      console.log('  ...');
    }
  });

  runner.once('end', function() {
    console.log('# tests ' + (passes + failures));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(TAP, Base);

/**
 * Return a TAP-safe title of `test`
 *
 * @api private
 * @param {Object} test
 * @return {String}
 */
function title(test) {
  return test.fullTitle().replace(/#/g, '');
}
