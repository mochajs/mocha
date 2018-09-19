'use strict';
/**
 * @module TAP
 */
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
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 */
function TAP(runner) {
  Base.call(this, runner);

  var n = 1;
  var passes = 0;
  var failures = 0;

  function yamlIndent(level) {
    return Array(level + 1).join('  ');
  }

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
      console.log(yamlIndent(1), '---');
      if (err.message) {
        console.log(yamlIndent(2), 'message: |-');
        console.log(err.message.replace(/^/gm, yamlIndent(3)));
      }
      if (err.stack) {
        console.log(yamlIndent(2), 'stack: |-');
        console.log(err.stack.replace(/^/gm, yamlIndent(3)));
      }
      console.log(yamlIndent(1), '...');
    }
  });

  runner.once('end', function() {
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
function title(test) {
  return test.fullTitle().replace(/#/g, '');
}
