'use strict';

var textDiff = require('diff');
var wordDiff = require('./word-diff');
var utils = require('../../utils');

function split (value) {
  var tokens = value.split(/\n|\r\n/);
  // Ignore the final empty token that occurs if the string ends with a new line
  if (!tokens[tokens.length - 1]) {
    tokens.pop();
  }
  return tokens;
}

function fill (result, kind, arr) {
  for (var i = 0; i < arr.length; ++i) {
    var changes = arr[i];
    if (changes.length === 1) {
      result.push({ kind: kind, value: changes[0].value });
    } else
    if (changes.length > 0) {
      result.push({ kind: kind, changes: changes });
    }
  }
}

function append (arr, i, inlineChange) {
  if (i === 0) {
    arr[arr.length - 1].push(inlineChange);
  } else {
    arr.push([inlineChange]);
  }
}

function fillChanges (result, del, ins) {
  function asChange (line) {
    if (change.added) { return { kind: '+', value: line }; }
    if (change.removed) { return { kind: '-', value: line }; }
    return { kind: ' ', value: line };
  }

  var inlineDiff = wordDiff.diff(
    del.join('\n'),
    ins.join('\n')
  );

  // Changes in each line
  var delChanges = [[]];
  var insChanges = [[]];
  for (var i = 0; i < inlineDiff.length; ++i) {
    var change = inlineDiff[i];
    if (change.value.length === 0) {
      continue;
    }

    change.value.split('\n').forEach(function (line, i) {
      if (line.length === 0) { return; }

      line = asChange(line);
      if (!change.added) {
        append(delChanges, i, line);
      }
      if (!change.removed) {
        append(insChanges, i, line);
      }
    });
  }

  fill(result, '-', delChanges);
  fill(result, '+', insChanges);
}

var push = Array.prototype.push;

function convert (lines) {
  var result = [];
  var del = [];// texts of deleted lines
  var ins = [];// texts of inserted lines
  var lastKind = ' ';
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    var kind = line.added ? '+' : (line.removed ? '-' : ' ');
    var text = split(line.value);

    if (line.removed) {
      push.apply(del, text);
    } else
    if (line.added) {
      push.apply(ins, text);
    } else {
      if (kind !== lastKind) {
        fillChanges(result, del, ins);
        del = [];
        ins = [];
      }
      text.forEach(function (t) { result.push({ kind: kind, value: t }); });
    }
    lastKind = kind;
  }
  if (del.length > 0 || ins.length > 0) {
    fillChanges(result, del, ins);
  }
  return result;
}

/**
 * Creates diffs for given error by comparing `expected` and `actual` converted to strings.
 *
 * @api public
 * @param {Object} expected
 * @param {Object} actual
 * @return {Object} Generated structured diff
 */
function generateDiff (expected, actual) {
  if (!utils.isString(expected) || !utils.isString(actual)) {
    expected = utils.stringify(expected);
    actual = utils.stringify(actual);
  }

  return convert(textDiff.diffLines(expected, actual));
}

module.exports = generateDiff;
