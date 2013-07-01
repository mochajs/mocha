
/**
 * Module dependencies.
 */

var Base = require('./base')
  , output = Base.output
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

function TAP(runner, ostream) {
  Base.call(this, runner, ostream);

  var self = this
    , stats = this.stats
    , n = 1
    , passes = 0
    , failures = 0;

  runner.on('start', function(){
    var total = runner.grepTotal(runner.suite);
    output.log('%d..%d', 1, total);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pending', function(test){
    output.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test){
    passes++;
    output.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err){
    failures++;
    output.log('not ok %d %s', n, title(test));
    if (err.stack) output.log(err.stack.replace(/^/gm, '  '));
  });

  runner.on('end', function(){
    output.log('# tests ' + (passes + failures));
    output.log('# pass ' + passes);
    output.log('# fail ' + failures);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @param {Object} test
 * @return {String}
 * @api private
 */

function title(test) {
  return test.fullTitle().replace(/#/g, '');
}
