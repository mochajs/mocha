const mocha = require('mocha');
module.exports = simplereporter;

function simplereporter (runner) {
  mocha.reporters.Base.call(this, runner);

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
