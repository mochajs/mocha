
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

function Teamcity(runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('start', function() {
    console.log("##teamcity[testSuiteStarted name='mocha.suite']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='" + test.fullTitle() + "']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + test.fullTitle() + "' message='" + err.message + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='" + test.fullTitle() + "' message='pending']");
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='" + test.fullTitle() + "' duration='" + test.duration + "']");
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + stats.duration + "']");
  });
}
