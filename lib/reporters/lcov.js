
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `LCov`.
 */

exports = module.exports = LCov;

/**
 * Initialize a new `JsCoverage` reporter.
 * File format of LCOV can be found here: http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php
 * The reporter is built after this parser: https://raw.github.com/SonarCommunity/sonar-javascript/master/sonar-javascript-plugin/src/main/java/org/sonar/plugins/javascript/coverage/LCOVParser.java
 *
 * @param {Runner} runner
 * @api public
 */

function LCov(runner) {
  var self = this;

  Base.call(this, runner);

  runner.on('end', function(){
    var cov = global._$jscoverage || {};

    for (var filename in cov) {
      var data = cov[filename];
      reportFile(filename, data);
    }
  });
}

function reportFile(filename, data) {
  process.stdout.write('SF:' + filename + '\n');

  data.source.forEach(function(line, num) {
    // increase the line number, as JS arrays are zero-based
    num++;

    if (data[num] !== undefined) {
      process.stdout.write('DA:' + num + ',' + data[num] + '\n');
    }
  });
}
