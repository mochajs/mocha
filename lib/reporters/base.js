
/**
 * Module dependencies.
 */

var tty = require('tty');

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = tty.isatty(1) && tty.isatty(2);

/**
 * Expose `Base`.
 */

exports = module.exports = Base;

/**
 * Enable coloring by default.
 */

exports.useColors = isatty;

/**
 * Default color map.
 */

exports.colors = {
    'pass': 90
  , 'pass message': 32
  , 'fail': 31
  , 'fail message': 31
  , 'error title': 0
  , 'error message': 31
  , 'error stack': 90
  , 'checkmark': 32
  , 'fast': 90
  , 'medium': 33
  , 'slow': 31
};

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {String} type
 * @param {String} str
 * @return {String}
 * @api private
 */

var color = exports.color = function(type, str) {
  if (!exports.useColors) return str;
  return '\033[' + exports.colors[type] + 'm' + str + '\033[0m';
};

/**
 * Expose term window size, with some
 * defaults for when stderr is not a tty.
 */

exports.window = {
  width: isatty ? tty.getWindowSize(1)[1] : 75
};

/**
 * Expose some basic cursor interactions
 * that are common among reporters.
 */

exports.cursor = {
  hide: function(){
    process.stdout.write('\033[?25l');
  },

  show: function(){
    process.stdout.write('\033[?25h');
  }
};

/**
 * Outut the given `failures` as a list.
 *
 * @param {Array} failures
 * @api public
 */

exports.list = function(failures){
  console.log();
  failures.forEach(function(test, i){
    // format
    var fmt = color('error title', '  %s) %s: ')
      + color('error message', '%s')
      + color('error stack', '\n%s\n');

    // msg
    var stack = test.err.stack
      , index = stack.indexOf('at')
      , msg = stack.slice(0, index);

    // indent stack trace without msg
    stack = stack.slice(index)
      .replace(/^/gm, '  ');

    console.log(fmt, i, test.title, msg, stack);
  });
};

/**
 * Initialize a new `Base` reporter.
 *
 * All other reporters generally
 * inherit from this reporter, providing
 * stats such as test duration, number
 * of tests passed / failed etc.
 *
 * @param {Runner} runner
 * @api public
 */

function Base(runner) {
  var self = this
    , stats = this.stats = {}
    , failures = this.failures = [];

  runner.on('start', function(){
    stats.start = new Date;
  });

  runner.on('suite', function(suite){
    stats.suites = stats.suites || 0;
    stats.suites++;
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function(test){
    stats.passes = stats.passes || 0;
    // TODO: configurable
    test.speed = test.duration < 20
      ? 'fast'
      : test.duration < 75
        ? 'medium'
        : 'slow';
    stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function(){
    stats.end = new Date;
    stats.duration = new Date - stats.start;
  });
}

/**
 * Output common epilogue used by many of
 * the bundled reporters.
 *
 * @api public
 */

Base.prototype.epilogue = function(){
  var stats = this.stats;

  console.log();

  // failure
  if (stats.failures) {
    console.log(
        color('fail message', '  ✖ %d of %d tests failed')
      , stats.failures, stats.tests);
    Base.list(this.failures);
    console.log();
    process.nextTick(function(){
      process.exit(stats.failures);
    });
    return;
  }

  // pass
  console.log(
      color('pass message', '  ✔ %d tests completed in %dms')
    , stats.tests || 0
    , stats.duration);

  console.log();
  process.nextTick(function(){
    process.exit(0);
  });
};
