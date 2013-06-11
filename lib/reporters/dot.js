
/**
 * Module dependencies.
 */

var Base = require('./base')
  , output = Base.output
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

  runner.on('start', function(){
    output.write('\n  ');
  });

  runner.on('pending', function(test){
    output.write(color('pending', Base.symbols.dot));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) output.write('\n  ');
    if ('slow' == test.speed) {
      output.write(color('bright yellow', Base.symbols.dot));
    } else {
      output.write(color(test.speed, Base.symbols.dot));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) output.write('\n  ');
    output.write(color('fail', Base.symbols.dot));
  });

  runner.on('end', function(){
    output.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype.__proto__ = Base.prototype;
