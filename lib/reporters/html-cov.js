/**
 * Module dependencies.
 */

var JSONCov = require('./json-cov');
var inherits = require('../utils').inherits;
var readFileSync = require('fs').readFileSync;
var join = require('path').join;

/**
 * Expose `HTMLCov`.
 */

exports = module.exports = HTMLCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function HTMLCov(runner, options, outputPath) {
  JSONCov.call(this, runner, options, outputPath, false);

  var jade = require('jade');
  var file = join(__dirname, '/templates/coverage.jade');
  var str = readFileSync(file, 'utf8');
  var fn = jade.compile(str, { filename: file });
  var self = this;

  runner.on('end', function() {
    self.write(fn({
      cov: self.cov,
      coverageClass: coverageClass
    }));
  });
}

/**
 * Inherit from `JSONCov.prototype`.
 */
inherits(HTMLCov, JSONCov);

/**
 * Return coverage class for a given coverage percentage.
 *
 * @api private
 * @param {number} coveragePctg
 * @return {string}
 */
function coverageClass(coveragePctg) {
  if (coveragePctg >= 75) {
    return 'high';
  }
  if (coveragePctg >= 50) {
    return 'medium';
  }
  if (coveragePctg >= 25) {
    return 'low';
  }
  return 'terrible';
}
