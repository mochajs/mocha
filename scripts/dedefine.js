'use strict';

/**
 * This is a transform stream we're using to strip AMD calls from
 * dependencies in our Browserify bundle.
 */

var through = require('through2');
var defineRx = /typeof\s+define\s*===?\s*['"]function['"]\s*&&\s*(?:define\.amd|typeof\s+define\.amd\s*===?\s*['"]object['"]\s*&&\s*define\.amd)/g;
function createStream () {
  return through.obj(function (chunk, enc, next) {
    this.push(String(chunk)
      .replace(defineRx, 'false'));
    next();
  });
}

module.exports = function (b) {
  function wrap () {
    b.pipeline.get('wrap').push(createStream());
  }

  b.on('reset', wrap);
  wrap();
};
