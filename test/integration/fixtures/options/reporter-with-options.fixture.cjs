'use strict';

function ReporterWithOptions(runner, options) {
  console.log(JSON.stringify(options.reporterOption));
}

module.exports = ReporterWithOptions;
