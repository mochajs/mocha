'use strict';

var baseReporter = require('../../../lib/reporters/base');
module.exports = simplereporter;

function simplereporter (runner) {
  baseReporter.call(this, runner);

  runner.on('suite', function (suite) {
    console.log('on(\'suite\') called');
  });

  runner.on('fail', function (test, err) {
    console.log('on(\'fail\') called');
  });

  runner.on('pass', function (test) {
    console.log('on(\'pass\') called');
  });

  runner.on('test end', function (test, err) {
    console.log('on(\'test end\') called');
  });

  runner.on('end', function () {
    console.log('on(\'end\') called');
  });
}
