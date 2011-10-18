
/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function TAP(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , n = 1;

  runner.on('start', function(){
    console.log('  %d..%d', 1, total);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pass', function(test){
    console.log('  ok %d %s', n, test.fullTitle());
  });

  runner.on('fail', function(test){
    console.log('  not ok %d %s', n, test.fullTitle());
  });

  runner.on('end', function(){
    process.exit(stats.failures);
  });
}