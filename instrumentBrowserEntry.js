'use strict';

var browserifyIstanbul = require('browserify-istanbul');

var nyc = require('./nycInstrumenter');

var overrideOptions = { ignore: ['**/lib/**', '**/node_modules/**', '**/test/**'], instrumenter: nyc };

module.exports = function (file, options) {
  return browserifyIstanbul(file, Object.assign({}, options, overrideOptions));
};
