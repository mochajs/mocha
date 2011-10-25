
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

  // test started
  runner.on('test', function(test){
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  // test passed
  runner.on('pass', function(test){
    var fmt = color('checkmark', '  ✔')
      + color('pass', ' %s: ')
      + color(test.speed, '%dms');
    console.log('\r' + fmt, test.fullTitle(), test.duration);
  });

  // test failed
  runner.on('fail', function(test, err){
    console.log('\r' + color('fail', '  %d) %s'), n++, test.fullTitle());
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

List.prototype.__proto__ = Base.prototype;