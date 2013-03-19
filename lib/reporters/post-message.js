
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `PostMessage`.
 */

exports = module.exports = PostMessageReporter;

/**
 * Initialize a new `PostMessage` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function PostMessageReporter(runner) {
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
    global.postMessage({ type: 'pass', test: clean(test) });
  });

  runner.on('fail', function(test){
    failures.push(test);
    global.postMessage({ type: 'fail', test: clean(test) });
  });

  runner.on('end', function(){
    var obj = {
        type: 'done'
      , stats: self.stats
      , tests: tests.map(clean)
      , failures: failures.map(clean)
      , passes: passes.map(clean)
    };
    global.postMessage(obj);
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
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
