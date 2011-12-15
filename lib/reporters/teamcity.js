
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
    console.log("##teamcity[testStarted name='%s']", test.fullTitle());
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='%s' message='%s']", test.fullTitle(), err.message);
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='%s' message='pending']", test.fullTitle());
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='%s' duration='%s']", test.fullTitle(), test.duration);
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='%s']", stats.duration);
  });
}
