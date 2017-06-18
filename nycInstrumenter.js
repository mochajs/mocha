'use strict';

var defaultOptions = {
  autoWrap: true,
  embedSource: true,
  produceSourceMap: true,
  noCompact: false
};

var istanbulLib;
try {
  istanbulLib = require('nyc/node_modules/istanbul-lib-instrument');
} catch (ignore) {
  istanbulLib = require('istanbul-lib-instrument');
}
module.exports = { Instrumenter: function (options) { return istanbulLib.createInstrumenter(Object.assign({}, defaultOptions, options)); } };
