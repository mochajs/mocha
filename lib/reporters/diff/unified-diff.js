'use strict';

var toHunks = require('structured-diff/lib/hunk');
var inherits = require('../../utils').inherits;
var ConsolePrinter = require('./console-printer');

function UnifiedDiff (color, indent) {
  ConsolePrinter.call(this, color, indent);
}

/**
 * Inherit from `ConsolePrinter.prototype`.
 */
inherits(UnifiedDiff, ConsolePrinter);

UnifiedDiff.prototype.inlineIns = function (str) {
  return this.color('inline diff added', str);
};

UnifiedDiff.prototype.inlineDel = function (str) {
  return this.color('inline diff removed', str);
};

UnifiedDiff.prototype.text = function (line) {
  var self = this;
  return line.kind + (line.changes
    ? line.changes.map(function (change) {
      if (change.kind === '+') { return self.inlineIns(change.value); }
      if (change.kind === '-') { return self.inlineDel(change.value); }
      return change.value;
    }).join('')
    : line.value
  );
};

UnifiedDiff.prototype.colorize = function (line) {
  if (line.kind === '+') { return this.ins(this.text(line)); }
  if (line.kind === '-') { return this.del(this.text(line)); }
  return line.kind + line.value;
};

/**
 * Converts a unified diff between two strings to coloured text representation.
 *
 * @api public
 * @param {Object} diff Structured differences of actual from expected
 * @param {number?} context Count of context lines befor and after changed lines in diff output.
 *        If not specified or negative, output all lines (infinity count of context lines)
 * @return {string} The diff for output to the console.
 */
UnifiedDiff.prototype.print = function (diff, context) {
  var hunks = toHunks(diff, context);
  var width = String(diff.length).length;
  var lines = this.stringify(hunks, diff.length > 4, width);

  lines.push('');

  return '\n' +
    this.indent + this.del('- expected') + ' ' + this.inlineDel('(removed piece)') + '\n' +
    this.indent + this.ins('+ actual') + ' ' + this.inlineIns('(added piece)') + '\n' +
    '\n' +
    lines.join('\n');
};

module.exports = UnifiedDiff;
