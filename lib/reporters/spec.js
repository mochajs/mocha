'use strict';
/**
 * @module Spec
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;
var color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @public
 * @class
 * @memberof Mocha.reporters
 * @extends Mocha.reporters.Base
 * @api public
 * @param {Runner} runner
 * @param {Object} [options]
 * @param {any} [options.reporterOptions.showErrorsImmediately] - if truthy, errors will be shown
 * immediately after tests fail instead of after all tests have finished.
 */
function Spec(runner, options) {
  Base.call(this, runner, options);
  options = options || {};

  var self = this;
  var indents = 0;
  var n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('start', function() {
    console.log();
  });

  runner.on('suite', function(suite) {
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function() {
    --indents;
    if (indents === 1) {
      console.log();
    }
  });

  runner.on('pending', function(test) {
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test) {
    var fmt;
    if (test.speed === 'fast') {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt =
        indent() +
        color('checkmark', '  ' + Base.symbols.ok) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  var showErrorsImmediately =
    options.reporterOptions && options.reporterOptions.showErrorsImmediately;

  runner.on('fail', function(test) {
    if (showErrorsImmediately) {
      Base.logTestFailure(test, n++, {titleColor: 'fail'});
    } else {
      console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
    }
  });

  runner.once(
    'end',
    self.epilogue.bind(self, {showFailures: !showErrorsImmediately})
  );
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Spec, Base);
