
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

function Dot(runner, ostream) {
  Base.call(this, runner, ostream);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = 0;

  runner.on('start', function(){
    ostream.write('\n  ');
  });

  runner.on('pending', function(test){
    ostream.write(color('pending', Base.symbols.dot));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) ostream.write('\n  ');
    if ('slow' == test.speed) {
      ostream.write(color('bright yellow', Base.symbols.dot));
    } else {
      ostream.write(color(test.speed, Base.symbols.dot));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) ostream.write('\n  ');
    ostream.write(color('fail', Base.symbols.dot));
  });

  runner.on('end', function(){
    ostream.write("\n");
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype.__proto__ = Base.prototype;
