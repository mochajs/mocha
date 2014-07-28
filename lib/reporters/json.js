
/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test, err){
    failures.push(test);
    if (err === Object(err)) {
      test.errMsg = err.message;
      test.errStack = err.stack;
    }
  });

  runner.on('end', function(){
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };
    runner.testResults = obj;

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    err: test.err,
    errStack: test.err.stack,
    errMessage: test.err.message
  }
}
