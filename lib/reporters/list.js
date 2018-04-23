'use strict';
/**
 * @module List
 */
/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;
var color = Base.color;
var cursor = Base.cursor;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
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
function List(runner, options) {
  Base.call(this, runner, options);
  options = options || {};

  var self = this;
  var n = 0;

  runner.on('start', function() {
    console.log();
  });

  runner.on('test', function(test) {
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on('pending', function(test) {
    var fmt = color('checkmark', '  -') + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on('pass', function(test) {
    var fmt =
      color('checkmark', '  ' + Base.symbols.ok) +
      color('pass', ' %s: ') +
      color(test.speed, '%dms');
    cursor.CR();
    console.log(fmt, test.fullTitle(), test.duration);
  });

  var showErrorsImmediately =
    options.reporterOptions && options.reporterOptions.showErrorsImmediately;

  runner.on('fail', function(test) {
    if (showErrorsImmediately) {
      Base.logTestFailure(test, n++, {titleColor: 'fail'});
    } else {
      cursor.CR();
      console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
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
inherits(List, Base);
