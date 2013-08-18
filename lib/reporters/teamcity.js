
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
    console.log("##teamcity[testStarted name='" + escape(test.fullTitle()) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + escape(test.fullTitle()) + "'" + (err.message ? (" message='" + escape(err.message) + "'" ) : "" ) + " details='message and stack trace' expected='" + escape(err.expected) + "' actual='" + escape(err.actual) + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='" + escape(test.fullTitle()) + "' message='pending']");
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='" + escape(test.fullTitle()) + "' duration='" + test.duration + "']");
  });

  runner.on('suite', function(suite){
    suite.startDate = new Date();
    if(suite.fullTitle() != ""){
      console.log("##teamcity[testSuiteStarted name='" + escape(suite.fullTitle()) + "']");
    }
  });

  runner.on('suite end', function(suite){
    if(suite.fullTitle() != ""){
      console.log("##teamcity[testSuiteFinished name='" + escape(suite.fullTitle()) + "' duration='" + (new Date() - suite.startDate) + "']");
    }
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + stats.duration + "']");
  });

}

/**
 * Escape the given `str`.
 */

function escape(str) {
  str = String(str);
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
