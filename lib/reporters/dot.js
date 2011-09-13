
/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Dot(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = 0;

  // tests started
  runner.on('start', function(){
    process.stdout.write('\n  ');
  });

  // test passed, output a dot
  runner.on('pass', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('pass', '.'));
  });

  // test failed, output a dot
  runner.on('fail', function(test, err){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('fail', '.'));
  });

  runner.on('end', function(){
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype.__proto__ = Base.prototype;