'use strict';

/**
 * Module dependencies.
 */

var tty = require('tty');
var diff = require('diff');
var ms = require('../ms');
var utils = require('../utils');
var supportsColor = process.browser ? null : require('supports-color');

/**
 * Expose `Base`.
 */

exports = module.exports = Base;

/**
 * Save timer references to avoid Sinon interfering.
 * See: https://github.com/mochajs/mocha/issues/237
 */

/* eslint-disable no-unused-vars, no-native-reassign */
var Date = global.Date;
var setTimeout = global.setTimeout;
var setInterval = global.setInterval;
var clearTimeout = global.clearTimeout;
var clearInterval = global.clearInterval;
/* eslint-enable no-unused-vars, no-native-reassign */

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = tty.isatty(1) && tty.isatty(2);

/**
 * Enable coloring by default, except in the browser interface.
 */

exports.useColors = !process.browser && (supportsColor || (process.env.MOCHA_COLORS !== undefined));

/**
 * Inline diffs instead of +/-
 */

exports.inlineDiffs = false;

/**
 * Default color map.
 */

exports.colors = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31
};

/**
 * Default symbol map.
 */

exports.symbols = {
  ok: '✓',
  err: '✖',
  dot: '․',
  comma: ',',
  bang: '!'
};

// With node.js on Windows: use symbols available in terminal default fonts
if (process.platform === 'win32') {
  exports.symbols.ok = '\u221A';
  exports.symbols.err = '\u00D7';
  exports.symbols.dot = '.';
}

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {string} type
 * @param {string} str
 * @return {string}
 * @api private
 */
var color = exports.color = function (type, str) {
  if (!exports.useColors) {
    return String(str);
  }
  return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
};

/**
 * Expose term window size, with some defaults for when stderr is not a tty.
 */

exports.window = {
  width: 75
};

if (isatty) {
  exports.window.width = process.stdout.getWindowSize
    ? process.stdout.getWindowSize(1)[0]
    : tty.getWindowSize()[1];
}

/**
 * Expose some basic cursor interactions that are common among reporters.
 */

exports.cursor = {
  hide: function () {
    isatty && process.stdout.write('\u001b[?25l');
  },

  show: function () {
    isatty && process.stdout.write('\u001b[?25h');
  },

  deleteLine: function () {
    isatty && process.stdout.write('\u001b[2K');
  },

  beginningOfLine: function () {
    isatty && process.stdout.write('\u001b[0G');
  },

  CR: function () {
    if (isatty) {
      exports.cursor.deleteLine();
      exports.cursor.beginningOfLine();
    } else {
      process.stdout.write('\r');
    }
  }
};

function showDiff (err) {
  return (utils.type(err.diff) === 'function') ||
         (err.showDiff !== false && typeof err.expected !== 'undefined' && sameType(err.actual, err.expected));
}

/**
 * Returns a diff between 2 strings with coloured ANSI output.
 *
 * The diff will be either inline or unified dependant on the value
 * of `Base.inlineDiff`.
 *
 * @param {string} actual
 * @param {string} expected
 * @return {string} Diff
 */
exports.generateDiff = function (actual, expected) {
  var diff = doDiff(expected, actual, exports.inlineDiffs);

  return exports.inlineDiffs ? inlineDiff(diff) : unifiedDiff(diff);
};

/**
 * Output the given `failures` as a list.
 *
 * @param {Array} failures
 * @api public
 */

exports.list = function (failures) {
  console.log();
  failures.forEach(function (test, i) {
    // format
    var fmt = color('error title', '  %s) %s:\n') +
      color('error message', '     %s') +
      color('error stack', '\n%s\n');

    // msg
    var msg;
    var err = test.err;
    var message;
    if (err.message && typeof err.message.toString === 'function') {
      message = err.message + '';
    } else if (typeof err.inspect === 'function') {
      message = err.inspect() + '';
    } else {
      message = '';
    }
    var stack = err.stack || message;
    var index = message ? stack.indexOf(message) : -1;

    if (index === -1) {
      msg = message;
    } else {
      index += message.length;
      msg = stack.slice(0, index);
      // remove msg from stack
      stack = stack.slice(index + 1);
    }

    // uncaught
    if (err.uncaught) {
      msg = 'Uncaught ' + msg;
    }
    // explicitly show diff
    if (!exports.hideDiff && showDiff(err)) {
      fmt = color('error title', '  %s) %s:\n%s') + color('error stack', '\n%s\n');
      var match = message.match(/^([^:]+): expected/);
      msg = '\n      ' + color('error message', match ? match[1] : msg);

      msg += makeDiff(err);
    }

    // indent stack trace
    stack = stack.replace(/^/gm, '  ');

    // indented test title
    var testTitle = '';
    test.titlePath().forEach(function (str, index) {
      if (index !== 0) {
        testTitle += '\n     ';
      }
      for (var i = 0; i < index; i++) {
        testTitle += '  ';
      }
      testTitle += str;
    });

    console.log(fmt, (i + 1), testTitle, msg, stack);
  });
};

/**
 * Initialize a new `Base` reporter.
 *
 * All other reporters generally
 * inherit from this reporter, providing
 * stats such as test duration, number
 * of tests passed / failed etc.
 *
 * @param {Runner} runner
 * @api public
 */

function Base (runner) {
  var stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };
  var failures = this.failures = [];

  if (!runner) {
    return;
  }
  this.runner = runner;

  runner.stats = stats;

  runner.on('start', function () {
    stats.start = new Date();
  });

  runner.on('suite', function (suite) {
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  runner.on('test end', function () {
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function (test) {
    stats.passes = stats.passes || 0;

    if (test.duration > test.slow()) {
      test.speed = 'slow';
    } else if (test.duration > test.slow() / 2) {
      test.speed = 'medium';
    } else {
      test.speed = 'fast';
    }

    stats.passes++;
  });

  runner.on('fail', function (test, err) {
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.once('end', function () {
    stats.end = new Date();
    stats.duration = stats.end - stats.start;
  });

  runner.on('pending', function () {
    stats.pending++;
  });
}

/**
 * Output common epilogue used by many of
 * the bundled reporters.
 *
 * @api public
 */
Base.prototype.epilogue = function () {
  var stats = this.stats;
  var fmt;

  console.log();

  // passes
  fmt = color('bright pass', ' ') +
    color('green', ' %d passing') +
    color('light', ' (%s)');

  console.log(fmt,
    stats.passes || 0,
    ms(stats.duration));

  // pending
  if (stats.pending) {
    fmt = color('pending', ' ') +
      color('pending', ' %d pending');

    console.log(fmt, stats.pending);
  }

  // failures
  if (stats.failures) {
    fmt = color('fail', '  %d failing');

    console.log(fmt, stats.failures);

    Base.list(this.failures);
    console.log();
  }

  console.log();
};

/**
 * Pad the given `str` to `len`.
 *
 * @api private
 * @param {string} str
 * @param {string} len
 * @return {string}
 */
function pad (str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}

/**
 * Converts an inline diff between two strings to coloured text representation.
 *
 * @api private
 * @param {Object} diff structured differences actual from expected
 * @return {string} The diff for output to the console.
 */
function inlineDiff (diff) {
  var indent = '      ';
  var lines = [''];
  diff.forEach(function (change) {
    function colorize (line) {
      if (change.added) {
        return color('diff added', line);
      }
      if (change.removed) {
        return color('diff removed', line);
      }
      return line;
    }

    change.value.split('\n').forEach(function (line, i) {
      line = colorize(line);
      if (i === 0) {
        line = lines.pop() + line;
      }
      lines.push(line);
    });
  });

  if (lines.length > 4) {
    var width = String(lines.length).length;
    lines = lines.map(function (line, i) { return indent + pad(i + 1, width) + ' | ' + line; });
  } else {
    lines = lines.map(function (line) { return indent + line; });
  }
  lines.push('');

  return '\n' + indent +
    color('diff removed', 'expected') + ' ' +
    color('diff added', 'actual') +
    '\n\n' +
    lines.join('\n');
}

/**
 * Converts a unified diff between two strings to coloured text representation.
 *
 * @api private
 * @param {Object} diff structured differences actual from expected
 * @return {string} The diff for output to the console.
 */
function unifiedDiff (diff) {
  var indent = '      ';
  function colorize (line) {
    if (line[0] === '+') {
      return indent + color('diff added', line);
    }
    if (line[0] === '-') {
      return indent + color('diff removed', line);
    }
    return indent + line;
  }

  var lines = [];
  diff.hunks.forEach(function (hunk, i) {
    if (i !== 0) {
      lines.push('--');
    }
    hunk.lines.forEach(function (line) {
      if (!line.match(/\\ No newline/)) {
        lines.push(colorize(line));
      }
    });
  });
  lines.push('');

  return '\n' + indent +
    color('diff removed', '- expected') + ' ' +
    color('diff added', '+ actual') +
    '\n\n' +
    lines.join('\n');
}

/**
 * Creates diffs for given error by comparing `expected` and `actual` converted to strings.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @return {string} The diff for output to the console.
 */
function makeDiff (err) {
  var diff = utils.type(err.diff) === 'function'
    ? err.diff(exports.inlineDiffs)
    : generateDiff(err, exports.inlineDiffs);

  return exports.inlineDiffs ? inlineDiff(diff) : unifiedDiff(diff);
}

/**
 * Creates diffs for given error by comparing `expected` and `actual` converted to strings.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @param {boolean} inline Format of generated diff
 * @return {Object} Generated structured diff in requested format
 */
function generateDiff (err, inline) {
  var actual = err.actual;
  var expected = err.expected;

  if (!utils.isString(actual) || !utils.isString(expected)) {
    actual = utils.stringify(actual);
    expected = utils.stringify(expected);
  }

  return doDiff(expected, actual, inline);
}

/**
 * Creates diffs for given `expected` and `actual` converted to strings.
 *
 * @api private
 * @param {string} expected Value that shows in diff as removed part
 * @param {string} actual Value that shows in diff as added part
 * @param {boolean} inline Format of generated diff
 * @return {Object} Generated structured diff in requested format
 */
function doDiff (expected, actual, inline) {
  return inline
    ? diff.diffWordsWithSpace(expected, actual)
    : diff.structuredPatch(null, null, expected, actual);
}

/**
 * Object#toString reference.
 */
var objToString = Object.prototype.toString;

/**
 * Check that a / b have the same type.
 *
 * @api private
 * @param {Object} a
 * @param {Object} b
 * @return {boolean}
 */
function sameType (a, b) {
  return objToString.call(a) === objToString.call(b);
}
