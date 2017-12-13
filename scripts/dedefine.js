'use strict';

/**
 * This is a transform stream we're using to strip AMD calls from
 * dependencies in our Browserify bundle.
 */

const through = require('through2');
const defineRx = /typeof\s+define\s*===?\s*['"]function['"]\s*&&\s*(?:define\.amd|typeof\s+define\.amd\s*===?\s*['"]object['"]\s*&&\s*define\.amd)/g;
function createStream () {
  return through.obj(function (chunk, enc, next) {
    this.push(String(chunk)
      .replace(defineRx, 'false'));
    next();
  });
}

module.exports = b => {
  const wrap = () => {
    b.pipeline.get('wrap').push(createStream());
  };

  b.on('reset', wrap);
  wrap();
};
