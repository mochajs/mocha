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

function needOutput (lines, i) {
  return i < lines.length ? lines[i].kind !== ' ' : false;
}

function withContext (lines, context) {
  if (typeof context === 'undefined' || (context | 0) < 0) {
    return lines.map(function (x) { return x.value; });
  }

  var lookahead = Array.from({ length: context }, function (_, i) { return needOutput(lines, i + 1); });
  var lookatail = Array(context).fill(false);
  var result = [];
  var lastInclude = false;

  for (var i = 0; i < lines.length; ++i) {
    var hasChange = lines[i].kind !== ' ';
    var include = hasChange ||
        lookahead.some(function (x) { return x; }) ||
        lookatail.some(function (x) { return x; });
    if (include) {
      result.push(lines[i].value);
    } else
    if (include !== lastInclude) {
      result.push('--');
    }
    lookahead[i % context] = needOutput(lines, i + 1 + context);
    lookatail[i % context] = hasChange;
    lastInclude = include;
  }
  return result;
}

function InlineDiff (color, indent) {
  this.color = color;
  this.indent = indent;
}

InlineDiff.prototype.ins = function (str) {
  return this.color('diff added', str);
};

InlineDiff.prototype.del = function (str) {
  return this.color('diff removed', str);
};

InlineDiff.prototype.change = function (str) {
  return this.color('inline diff changed', str);
};

InlineDiff.prototype.colorize = function (change) {
  if (change.kind === '+') { return this.ins(change.value); }
  if (change.kind === '-') { return this.del(change.value); }
  return change.value;
};

InlineDiff.prototype.mergeLine = function (delChanges, insChanges) {
  var result = [];
  var i = 0;
  var j = 0;

  for (; i < delChanges.length && j < insChanges.length;) {
    var del = delChanges[i];
    var ins = insChanges[j];

    if (del === ins) {
      result.push(del.value);
      ++i;
      ++j;
      continue;
    }
    if (del.kind !== ' ') {
      result.push(this.colorize(del));
      ++i;
      continue;
    }
    if (ins.kind !== ' ') {
      result.push(this.colorize(ins));
      ++j;
      continue;
    }
  }
  for (; i < delChanges.length; ++i) {
    result.push(this.colorize(delChanges[i]));
  }
  for (; j < insChanges.length; ++j) {
    result.push(this.colorize(insChanges[j]));
  }
  return result.join('');
};

InlineDiff.prototype.mergeLines = function (lines, del, ins) {
  var i = 0;
  var j = 0;

  for (; i < del.length && j < ins.length; ++i, ++j) {
    lines.push({ kind: '?', value: this.mergeLine(del[i], ins[j]) });
  }
  for (; i < del.length; ++i) {
    lines.push({ kind: '-', value: this.mergeLine(del[i], []) });
  }
  for (; j < ins.length; ++j) {
    lines.push({ kind: '+', value: this.mergeLine([], ins[j]) });
  }
};

InlineDiff.prototype.convert = function (changes) {
  var lines = [];
  var del = [];// texts of deleted lines
  var ins = [];// texts of inserted lines
  var lastKind = ' ';
  for (var i = 0; i < changes.length; ++i) {
    var change = changes[i];
    var kind = change.kind;

    if (kind === '-') {
      del.push(change.changes ? change.changes : [{ kind: '-', value: change.value }]);
    } else
    if (kind === '+') {
      ins.push(change.changes ? change.changes : [{ kind: '+', value: change.value }]);
    } else {
      if (kind !== lastKind) {
        this.mergeLines(lines, del, ins);
        del = [];
        ins = [];
      }
      lines.push(change);
    }
    lastKind = kind;
  }
  if (del.length > 0 || ins.length > 0) {
    this.mergeLines(lines, del, ins);
  }
  return lines;
};

InlineDiff.prototype.withLineNumbers = function (diff) {
  var width = String(diff.length).length;
  var i = 0;
  var j = 0;

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
    if (line.kind === '?') {
      del = this.change(del);
      ins = this.change(ins);
    }

    line.value = this.indent +
      del + ' | ' +
      ins + ' | ' +
      line.value;
  }
  return diff;
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
  var indent = this.indent;

  var lines = this.convert(diff);
  if (lines.length > 4) {
    this.withLineNumbers(lines);
  } else {
    lines.forEach(function (line) { line.value = indent + line.value; });
  }
  lines = withContext(lines, context);
  lines.push('');

  return '\n' + indent +
    this.del('expected') + ' ' +
    this.ins('actual') +
    '\n\n' +
    lines.join('\n');
};

module.exports = InlineDiff;
