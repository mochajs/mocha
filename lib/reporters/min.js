/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
 *
 * @param {Runner} runner
 * @api public
 */

function Min(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats;
  
  runner.on('start', function(){
    process.stdout.write('\033[2J');   // clear screen
    process.stdout.write('\033[1;3H'); // set cursor position
  });

  runner.on('end', function(){ self.epilogue(); });
}

/**
 * Inherit from `Base.prototype`.
 */

Min.prototype.__proto__ = Base.prototype;