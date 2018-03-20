'use strict';

var convert = require('structured-diff/lib/inline');
var toHunks = require('structured-diff/lib/hunk');
var inherits = require('../../utils').inherits;
var ConsolePrinter = require('./console-printer');

function InlineDiff (color, indent) {
  ConsolePrinter.call(this, color, indent);
}

/**
 * Inherit from `ConsolePrinter.prototype`.
 */
inherits(InlineDiff, ConsolePrinter);

/**
 * Colorize each inline change in the line.
 *
 * @param {Object} change Change for colorize
 * @return {string} Colorized string
 */
InlineDiff.prototype.colorizeChange = function (change) {
  if (change.kind === '+') { return this.ins(change.value); }
  if (change.kind === '-') { return this.del(change.value); }
  return change.value;
};

InlineDiff.prototype.colorize = function (line) {
  switch (line.kind) {
    case ' ': return line.value;
    case '+': return this.ins(line.value);
    case '-': return this.del(line.value);
    case '?': {
      var changes = line.changes;
      for (var i = 0; i < changes.length; ++i) {
        changes[i] = this.colorizeChange(changes[i]);
      }
      return changes.join('');
    }
    default: throw new Error('Unknown line.kind: ' + line.kind);
  }
};

/**
 * Converts an inline diff between two strings to coloured text representation.
 *
 * @api public
 * @param {Object} diff Structured differences actual from expected
 * @param {number?} context Count of context lines befor and after changed lines in diff output.
 *        If not specified or negative, output all lines (infinity count of context lines)
 * @return {string} The diff for output to the console.
 */
InlineDiff.prototype.print = function (diff, context) {
  var inline = convert(diff);
  var hunks = toHunks(inline, context);
  var width = String(inline.length).length;
  var lines = this.stringify(hunks, inline.length > 4, width);

  lines.push('');

  return '\n' + this.indent +
    this.del('expected') + ' ' +
    this.ins('actual') +
    '\n\n' +
    lines.join('\n');
};

module.exports = InlineDiff;
