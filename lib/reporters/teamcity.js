
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Teamcity(runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('start', function() {
    console.log("##teamcity[testSuiteStarted name='mocha.suite']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='%s']", escape(test.fullTitle()));
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='%s' message='%s']", escape(test.fullTitle()), escape(err.message));
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='%s' message='pending']", escape(test.fullTitle()));
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='%s' duration='%s']", escape(test.fullTitle()), test.duration);
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='%s']", stats.duration);
  });
}

/**
 * Escape the given `str`.
 */

function escape(str) {
  return str.replace(/'/g, "|'");
}