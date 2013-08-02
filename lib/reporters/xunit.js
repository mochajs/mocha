
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , fs = require('fs')
  , escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `XUnit`.
 */

exports = module.exports = XUnit;

/**
 * Initialize a new `XUnit` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function XUnit(runner, options) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;
    
  this.ostream = process.stdout;
  if (options !== undefined && options.output !== undefined) {
      self.ostream = fs.createWriteStream(options.output);
  }

  runner.on('pending', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    tests.push(test);
  });

  runner.on('fail', function(test){
    tests.push(test);
  });

  runner.on('end', function(){
    self.ostream.write(tag('testsuite', {
        name: 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skipped: stats.tests - stats.failures - stats.passes
      , timestamp: (new Date).toUTCString()
      , time: (stats.duration / 1000) || 0
    }, false));

    tests.forEach(function(t) { test(t, self.ostream); });
    self.ostream.write('</testsuite>\n');
  });
}

/**
 * Override done to close the stream (if it's a file).
 */
XUnit.prototype.done = function(failures, fn) {
    if (this.ostream !== process.stdout) {
        this.ostream.end(function() {
            fn(failures);
        });
    } else {
        fn(failures);
    }
};

/**
 * Inherit from `Base.prototype`.
 */

XUnit.prototype.__proto__ = Base.prototype;

/**
 * Output tag for the given `test.`
 */

function test(test, ostream) {
  var attrs = {
      classname: test.parent.fullTitle()
    , name: test.title
    , time: (test.duration / 1000) || 0
  };

  if ('failed' == test.state) {
    var err = test.err;
    attrs.message = escape(err.message);
    ostream.write(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));
  } else if (test.pending) {
    ostream.write(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    ostream.write(tag('testcase', attrs, true) );
  }
}

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , tag;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) tag += content + '</' + name + end;
  return tag + "\n";
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}
