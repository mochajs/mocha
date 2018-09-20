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
function TAP(runner, options) {
  Base.call(this, runner);

  var self = this;
  var n = 1;

  function yamlIndent(level) {
    return Array(level + 1).join('  ');
  }

  var tapSpec = '12';
  if (options && options.reporterOptions) {
    if (options.reporterOptions.spec) {
      var tapSpec = options.reporterOptions.spec;
    }
  }

  if (tapSpec === '13') {
    this.producer = new TAP13Producer();
  } else {
    this.producer = new TAP12Producer();
  }

  runner.on('start', function() {
    self.producer.writeStart(runner);
  });

  runner.on('test end', function() {
    ++n;
  });

  runner.on('pending', function(test) {
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test) {
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err) {
    console.log('not ok %d %s', n, title(test));
    var emitYamlBlock = err.message != null || err.stack != null;
    if (emitYamlBlock) {
      console.log(yamlIndent(1) + '---');
      if (err.message) {
        console.log(yamlIndent(2) + 'message: |-');
        console.log(err.message.replace(/^/gm, yamlIndent(3)));
      }
      if (err.stack) {
        console.log(yamlIndent(2) + 'stack: |-');
        console.log(err.stack.replace(/^/gm, yamlIndent(3)));
      }
      console.log(yamlIndent(1) + '...');
    }
  });

  runner.once('end', function() {
    console.log('# tests ' + (runner.stats.passes + runner.stats.failures));
    console.log('# pass ' + runner.stats.passes);
    console.log('# fail ' + runner.stats.failures);
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

/**
 * Inherit from `Base.prototype`.
 */
inherits(TAP, Base);

function TAP12Producer() {}

TAP12Producer.prototype.writeStart = function(runner) {
  var total = runner.grepTotal(runner.suite);
  console.log('%d..%d', 1, total);
};

function TAP13Producer() {}

TAP13Producer.prototype.writeStart = function(runner) {
  console.log('TAP version 13');
  var total = runner.grepTotal(runner.suite);
  console.log('%d..%d', 1, total);
};
