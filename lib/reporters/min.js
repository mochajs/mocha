
/**
 * Module dependencies.
 */

var Base = require('./base');

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

function Min(runner, ostream) {
  Base.call(this, runner, ostream);

  runner.on('start', function(){
    // clear screen
    ostream.write('\u001b[2J');
    // set cursor position
    ostream.write('\u001b[1;3H');
  });

  runner.on('end', this.epilogue.bind(this));
}

/**
 * Inherit from `Base.prototype`.
 */

Min.prototype.__proto__ = Base.prototype;
