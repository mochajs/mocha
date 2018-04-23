'use strict';
/**
 * @module Min
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
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
function Min(runner, options) {
  Base.call(this, runner, options);
  options = options || {};

  runner.on('start', function() {
    // clear screen
    process.stdout.write('\u001b[2J');
    // set cursor position
    process.stdout.write('\u001b[1;3H');
  });

  var showErrorsImmediately =
    options.reporterOptions && options.reporterOptions.showErrorsImmediately;
  var n = 0;

  if (showErrorsImmediately) {
    runner.on('fail', function(test) {
      Base.logTestFailure(test, n++, {titleColor: 'fail'});
    });
  }

  runner.once(
    'end',
    this.epilogue.bind(this, {showFailures: !showErrorsImmediately})
  );
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Min, Base);
