'use strict';

var diff = require('diff');
// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  ? Multiplication sign
//  - U+00F7  ? Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ? &#711;  Caron
//  - U+02D8  ? &#728;  Breve
//  - U+02D9  ? &#729;  Dot Above
//  - U+02DA  ? &#730;  Ring Above
//  - U+02DB  ? &#731;  Ogonek
//  - U+02DC  ? &#732;  Small Tilde
//  - U+02DD  ? &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var RE_WORDS_TO_MERGE = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;

var wordDiff = new diff.Diff();
wordDiff.tokenize = function (value) {
  var tokens = value.split(/([^\S\n\r]+|[\r\n()[\]{}"';,]|\b)/);
  // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
  for (var i = 0; i < tokens.length - 1; ++i) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] &&
        RE_WORDS_TO_MERGE.test(tokens[i]) &&
        RE_WORDS_TO_MERGE.test(tokens[i + 2])
    ) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }
  return tokens;
};

module.exports = wordDiff;
