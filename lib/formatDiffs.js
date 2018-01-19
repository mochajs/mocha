'use strict';

var colorUtils = require('./colorUtils');
var diff = require('diff');

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
 * Returns an inline diff between 2 strings with coloured ANSI output
 *
 * @api private
 * @param {Error} err with actual/expected
 * @return {string} Diff
 */
exports.inlineDiff = function inlineDiff (err, options) {
  var msg = errorDiff(err, options);

  // linenos
  var lines = msg.split('\n');
  if (lines.length > 4) {
    var width = String(lines.length).length;
    msg = lines.map(function (str, i) {
      return pad(++i, width) + ' |' + ' ' + str;
    }).join('\n');
  }

  // legend
  msg = '\n' +
    colorUtils.color('diff removed', 'actual', options) +
    ' ' +
    colorUtils.color('diff added', 'expected', options) +
    '\n\n' +
    msg +
    '\n';

  // indent
  msg = msg.replace(/^/gm, '      ');
  return msg;
};

/**
 * Returns a unified diff between two strings.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @param {object} options
 * @param {boolean} options.useColors Should the diff be displayed in color.
 * @return {string} The diff.
 */
exports.unifiedDiff = function unifiedDiff (err, options) {
  var indent = '      ';
  function cleanUp (line) {
    if (line[0] === '+') {
      return indent + colorLines('diff added', line, options);
    }
    if (line[0] === '-') {
      return indent + colorLines('diff removed', line, options);
    }
    if (line.match(/@@/)) {
      return '--';
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return indent + line;
  }
  function notBlank (line) {
    return typeof line !== 'undefined' && line !== null;
  }
  var msg = diff.createPatch('string', err.actual, err.expected);
  var lines = msg.split('\n').splice(5);
  return '\n      ' +
    colorLines('diff added', '+ expected', options) + ' ' +
    colorLines('diff removed', '- actual', options) +
    '\n\n' +
    lines.map(cleanUp).filter(notBlank).join('\n');
};

/**
 * Return a character diff for `err`.
 *
 * @api private
 * @param {Error} err with actual/expected
 * @param {object} options
 * @param {boolean} options.useColors Should the diff be displayed in color.
 * @return {string}
 */
function errorDiff (err, options) {
  return diff.diffWordsWithSpace(err.actual, err.expected).map(function (str) {
    if (str.added) {
      return colorLines('diff added', str.value, options);
    }
    if (str.removed) {
      return colorLines('diff removed', str.value, options);
    }
    return str.value;
  }).join('');
}

/**
 * Color lines for `str`, using the color `name`.
 *
 * **Note:** lines in `str` will only be coloured if `options.useColors === true`.
 *
 * @api private
 * @param {string} name
 * @param {string} str
 * @param {object} options
 * @return {string}
 */
function colorLines (name, str, options) {
  return str.split('\n').map(function (str) {
    return colorUtils.color(name, str, options);
  }).join('\n');
}
