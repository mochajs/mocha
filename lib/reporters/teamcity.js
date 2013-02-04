
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

  runner.on('suite', function(suite) {
    if (suite.root) return;
    console.log("##teamcity[testSuiteStarted name='" + escape(suite.title) + "']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='" + escape(test.title) + "']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + escape(test.title) + "' message='" + escape(err.message) + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='" + escape(test.title) + "' message='pending']");
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    console.log("##teamcity[testSuiteFinished name='" + escape(suite.title) + "']");
  });
}

/**
 * Escape the given `str`.
 */

function escape(str) {
  return str
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}