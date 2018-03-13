'use strict';

function UnifiedDiff (color, indent) {
  this.color = color;
  this.indent = indent;
}
/**
 * Converts a unified diff between two strings to coloured text representation.
 *
 * @api public
 * @param {Object} diff structured differences actual from expected
 * @return {string} The diff for output to the console.
 */
UnifiedDiff.prototype.print = function (diff) {
  var indent = this.indent;
  var color = this.color;

  function inlineColorize (change) {
    if (change.added) { return color('inline diff added', change.value); }
    if (change.removed) { return color('inline diff removed', change.value); }
    return change.value;
  }
  function colorize (line) {
    if (line.kind === '+') {
      let text = line.kind + line.changes.map(inlineColorize).join('');
      return indent + color('diff added', text);
    }
    if (line.kind === '-') {
      let text = line.kind + line.changes.map(inlineColorize).join('');
      return indent + color('diff removed', text);
    }
    return indent + line.kind + line.value;
  }

  var lines = [];
  diff.hunks.forEach(function (hunk, i) {
    if (i !== 0) {
      lines.push('--');
    }
    hunk.lines.forEach(function (line) {
      if (line.kind !== '\\') {
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
};

module.exports = UnifiedDiff;
