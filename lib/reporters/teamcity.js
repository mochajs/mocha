
/**
 * Module dependencies.
 */

var Base = require('./base');

function tc_escape(str) {
  return (str || '').replace(/'/g, "|'");
}

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
    console.log("##teamcity[testStarted name='%s']", tc_escape(test.fullTitle()));
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='%s' message='%s']", tc_escape(test.fullTitle()), tc_escape(err.message));
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='%s' message='pending']", tc_escape(test.fullTitle()));
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='%s' duration='%s']", tc_escape(test.fullTitle()), test.duration);
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='%s']", stats.duration);
  });
}
