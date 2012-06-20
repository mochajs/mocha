
/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color
  , fs = require('fs');

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

function JSONReporter(runner, output) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  if(output && output.file) {
    var outputStream = fs.createWriteStream(output.file)
  }

  function write(message) {
    if(outputStream) {
      outputStream.write(message)
    } else {
      process.stdout.write(message)
    }
  }

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var obj = {
        stats: self.stats
      , tests: tests.map(clean)
      , failures: failures.map(clean)
      , passes: passes.map(clean)
    };

    write(JSON.stringify(obj, null, 2));
    if(outputStream) {
      outputStream.end()
    }
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