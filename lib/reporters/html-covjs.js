
/**
 * Module dependencies.
 */

var CovJS = require('./covjs')
  , fs = require('fs');

/**
 * Expose `HTMLCovJS`.
 */

exports = module.exports = HTMLCovJS;

/**
 * Initialize a new `CoverJS` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTMLCovJS(runner) {
  var jade = require('jade')
    , file = __dirname + '/templates/scoverage.jade'
    , str = fs.readFileSync(file, 'utf8')
    , fn = jade.compile(str, { filename: file })
    , self = this;

  CovJS.call(this, runner, false);

  runner.on('end', function(){
    process.stdout.write(fn({
        cov: self.cov
      , coverageClass: coverageClass
    }));
  });
}

function coverageClass(n) {
  if (n >= 75) return 'high';
  if (n >= 50) return 'medium';
  if (n >= 25) return 'low';
  return 'terrible';
}