'use strict';

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
 * Color `str` with the given `type`.
 *
 * **Note:** `str` will only be coloured if `options.useColors === true`.
 *
 * @param {string} type
 * @param {string} str
 * @param {object} options
 * @return {string}
 * @api private
 */
exports.color = function color (type, str, options) {
  if (!options.useColors) {
    return String(str);
  }
  return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
};
