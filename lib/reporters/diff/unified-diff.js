'use strict';

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

function needOutput (diff, i) {
  return i < diff.length ? diff[i].kind !== ' ' : false;
}

function withContext (lines, diff, context) {
  if (typeof context === 'undefined' || (context | 0) < 0) {
    return lines;
  }

  var lookahead = Array.from({ length: context }, function (_, i) { return needOutput(diff, i + 1); });
  var lookatail = Array(context).fill(false);
  var result = [];
  var lastInclude = false;

  for (var i = 0; i < diff.length; ++i) {
    var kind = diff[i].kind;
    var include = kind !== ' ' ||
        lookahead.some(function (x) { return x; }) ||
        lookatail.some(function (x) { return x; });
    if (include) {
      result.push(lines[i]);
    } else
    if (include !== lastInclude) {
      result.push('--');
    }
    lookahead[i % context] = needOutput(diff, i + 1 + context);
    lookatail[i % context] = kind !== ' ';
    lastInclude = include;
  }
  return result;
}

function UnifiedDiff (color, indent) {
  this.color = color;
  this.indent = indent;
}

UnifiedDiff.prototype.ins = function (str) {
  return this.color('diff added', str);
};

UnifiedDiff.prototype.del = function (str) {
  return this.color('diff removed', str);
};

UnifiedDiff.prototype.inlineIns = function (str) {
  return this.color('inline diff added', str);
};

UnifiedDiff.prototype.inlineDel = function (str) {
  return this.color('inline diff removed', str);
};

UnifiedDiff.prototype.withLineNumbers = function (diff) {
  var width = String(diff.length).length;
  var i = 0;
  var j = 0;

  var lines = [];
  for (var k = 0; k < diff.length; ++k) {
    var line = diff[k];
    var del = '';
    var ins = '';
    if (line.kind !== '+') { ++i; del = i; }
    if (line.kind !== '-') { ++j; ins = j; }

    del = pad(del, width);
    ins = pad(ins, width);

    if (line.kind === '-') { del = this.del(del); }
    if (line.kind === '+') { ins = this.ins(ins); }

    lines.push(this.indent +
      del + ' | ' +
      ins + ' | ' +
      this.colorize(line)
    );
  }
  return lines;
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
  var self = this;

  var lines = diff.length > 4
    ? this.withLineNumbers(diff)
    : diff.map(function (line) { return self.indent + self.colorize(line); });

  lines = withContext(lines, diff, context);
  lines.push('');

  return '\n' +
    this.indent + this.del('- expected') + ' ' + this.inlineDel('(removed piece)') + '\n' +
    this.indent + this.ins('+ actual') + ' ' + this.inlineIns('(added piece)') + '\n' +
    '\n' +
    lines.join('\n');
};

module.exports = UnifiedDiff;
