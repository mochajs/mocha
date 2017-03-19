
/**
 * Module dependencies.
 */

var Base = require('./base');
var cursor = Base.cursor,
    color = Base.color;

/**
 * Expose `Fivemat`.
 */
exports = module.exports = Fivemat;

/**
 * Initialize a new `Fivemat` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Fivemat(runner) {
  Base.call(this, runner);

  var self = this,
      stats = this.stats,
      lastTitle = '',
      indents = 0;

  function indent() {
    return Array(indents).join('  ');
  }

  function title(test) {
    var full;
    while (test.parent && test.parent.fullTitle()) {
      test = test.parent;
    }

    return test.fullTitle();
  }

  runner.on('start', function() {
    indents++;
    indents++;
  });

  runner.on('suite', function(suite) {
    newTitle = title(suite);
    if (newTitle != lastTitle) {
      var line;
      line  = "\n";
      line += indent();
      line += color('suite', newTitle);
      line += ' ';

      process.stdout.write(line);
      lastTitle = newTitle;
    }
  });

  runner.on('pending', function(test){
    process.stdout.write(color('pending', Base.symbols.dot));
  });

  runner.on('pass', function(test){
    if ('slow' == test.speed) {
      process.stdout.write(color('bright yellow', Base.symbols.dot));
    } else {
      process.stdout.write(color(test.speed, Base.symbols.dot));
    }
  });

  runner.on('fail', function(test, err){
    process.stdout.write(color('fail', 'F'));
  });

  runner.on('end', function() {
    console.log('')
    self.epilogue();
  });
}

Fivemat.prototype.__proto__ = Base.prototype;
