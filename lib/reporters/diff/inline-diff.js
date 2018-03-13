'use strict';

function InlineDiff (color, indent) {
  this.color = color;
  this.indent = indent;
}

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
InlineDiff.prototype.print = function (diff) {
  var indent = this.indent;
  var color = this.color;

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
};

module.exports = InlineDiff;
