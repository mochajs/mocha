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
/**
 * Allow printing colored lines to the console. Subclasses must implement
 * `colorize(line)`method.
 *
 * @api public
 * @param {function(string, string)} color Function that returns colorized version of input value
 *        for given style
 * @param {string} indent Indent that will be appended to each line
 */
function ConsolePrinter (color, indent) {
  this.color = color;
  this.indent = indent;
}

ConsolePrinter.prototype.ins = function (str) {
  return this.color('diff added', str);
};

ConsolePrinter.prototype.del = function (str) {
  return this.color('diff removed', str);
};

ConsolePrinter.prototype.change = function (str) {
  return this.color('inline diff changed', str);
};

ConsolePrinter.prototype.stringifyHunk = function (result, hunk, withLineNumbers, width) {
  var lines = hunk.lines;
  var k;

  if (withLineNumbers) {
    var i = hunk.oldStart;
    var j = hunk.newStart;

    for (k = 0; k < lines.length; ++k) {
      var line = lines[k];
      var del = '';
      var ins = '';
      if (line.kind !== '+') { del = i++; }
      if (line.kind !== '-') { ins = j++; }

      del = pad(del, width);
      ins = pad(ins, width);

      // colorize numbers: line removed/inserted/changed
      if (line.kind === '-') { del = this.del(del); }
      if (line.kind === '+') { ins = this.ins(ins); }
      if (line.kind === '?') {
        del = this.change(del);
        ins = this.change(ins);
      }

      result.push(this.indent +
        del + ' | ' +
        ins + ' | ' +
        this.colorize(line)
      );
    }
  } else {
    for (k = 0; k < lines.length; ++k) {
      result.push(this.indent + this.colorize(lines[k]));
    }
  }
};

ConsolePrinter.prototype.stringify = function (hunks, withLineNumbers, width) {
  var result = [];
  for (var i = 0; i < hunks.length; ++i) {
    if (i !== 0) {
      result.push('--');
    }
    this.stringifyHunk(result, hunks[i], withLineNumbers, width);
  }
  return result;
};

module.exports = ConsolePrinter;
