
/**
 * Module dependencies.
 */

var JSONCov = require('./json-cov')
  , fs = require('fs');

/**
 * Expose `HTMLCov`.
 */

exports = module.exports = HTMLCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTMLCov(runner, output) {
  var jade = require('jade')
    , file = __dirname + '/templates/coverage.jade'
    , str = fs.readFileSync(file, 'utf8')
    , fn = jade.compile(str, { filename: file })
    , self = this;

  JSONCov.call(this, runner, {isDisabled: true});

  if(output && output.file) {
    var outputStream = fs.createWriteStream(output.file)
  }

  function write(message) {
    if(outputStream) {
      outputStream.write(message)
    } else {
      process.stdout.write(message)
    }
  }

  runner.on('end', function(){
    write(fn({
        cov: self.cov
      , coverageClass: coverageClass
    }));
    if(outputStream) {
      outputStream.end()
    }
  });
}

/**
 * Return coverage class for `n`.
 *
 * @return {String}
 * @api private
 */

function coverageClass(n) {
  if (n >= 75) return 'high';
  if (n >= 50) return 'medium';
  if (n >= 25) return 'low';
  return 'terrible';
}