
/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 0;

  // tests started
  runner.on('start', function(){
    console.log();
  });

  // test passed
  runner.on('pass', function(test){
    console.log(color('pass', '  %s'), test.fullTitle());
  });

  // test failed
  runner.on('fail', function(test, err){
    console.log(color('fail', '  %d) %s'), n++, test.fullTitle());
  });

  // tests are complete, output some stats
  // and the failures if any
  runner.on('end', function(){
    console.log();
    if (stats.failures) {
      console.log(color('fail message', '  ✖ %d of %d tests failed'), stats.failures, stats.tests);
      Base.list(self.failures);
    } else {
      console.log(color('pass message', '  ✔ %d tests completed in %dms'), stats.tests, stats.duration);
    }
    console.log();
    process.exit(stats.failures);
  });
}