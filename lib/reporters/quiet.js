/**
 * Module dependencies.
 */

var Base = require('./base');
var inherits = require('../utils').inherits;
var color = Base.color;
var cursor = Base.cursor;

/**
 * Expose `Quiet`.
 */

exports = module.exports = Quiet;

/**
 * Storing console debugging functionality to use later.
 */
var _console = {};
_console.log = console.log;
_console.error = console.error;
_console.warn = console.warn;
_console.info = console.info;

/**
 * Initialize a new `Quiet` test reporter.
 * Disables console debugging, outputs only test results.
 *
 * @api public
 * @param {Runner} runner
 */
function Quiet(runner) {
  console.log = function() {};
  console.error = function() {};
  console.warn = function() {};
  console.info = function() {};

  Base.call(this, runner, { logger: _console });

  var self = this;
  var indents = 0;
  var n = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('start', function() {
    _console.log();
  });

  runner.on('suite', function(suite) {
    ++indents;
    _console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function() {
    --indents;
    if (indents === 1) {
      _console.log();
    }
  });

  runner.on('pending', function(test) {
    var fmt = indent() + color('pending', '  - %s');
    _console.log(fmt, test.title);
  });

  runner.on('pass', function(test) {
    var fmt;
    if (test.speed === 'fast') {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s');
      cursor.CR();
      _console.log(fmt, test.title);
    } else {
      fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s')
        + color(test.speed, ' (%dms)');
      cursor.CR();
      _console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test) {
    cursor.CR();
    _console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Quiet, Base);
