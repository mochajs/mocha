
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
    num++;

    if (data[num] !== undefined) {
      process.stdout.write('DA:' + num + ',' + data[num] + '\n');
    }
  });
}
