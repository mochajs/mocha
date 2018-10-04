'use strict';

var baseReporter = require('../../../lib/reporters/base');
module.exports = optionsreporter;

function optionsreporter(runner, options) {
  baseReporter.call(this, runner, options);

  console.log(JSON.stringify(options.reporterOptions));
}
