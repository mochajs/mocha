
/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , escape = utils.escape;

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

function XUnit(runner) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;

  runner.on('test end', function(test) {
    tests.push(test);
  });

  runner.on('end', function() {
    console.error(tag('testsuite', {
        name: 'Mocha Tests',
        tests: stats.tests,
        failures: stats.failures,
        skip: (stats.tests - stats.failures - stats.passes),
        timestamp: (new Date).toUTCString(),
        time: stats.duration / 1000.0
    }, false));


    tests.forEach(test);
    console.error(end('testsuite'));    
  });
}

/**
 * Inherit from `Base.prototype`.
 */

XUnit.prototype.__proto__ = Base.prototype;

/**
 * Output tag for the given `test.`
 */

function test(test) {
  var attrs = {
      classname: test.fullTitle()
    , name: test.title
    , time: test.duration / 1000.0
  };

  if (test.failed) {
    var err = test.err;
    attrs.message = escape(err.message);
    console.error(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));
  } else if (test.pending) {
    console.error(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    console.error(tag('testcase', attrs, true) );
  }
}

function tag(name, attrs, single, content) {
  var tag;
  var end = single ? ' />' : '>'
  var strAttr = [];
  for (var attr in attrs) {
    attrs.hasOwnProperty(attr) && strAttr.push(attr + '="' + escape(attrs[attr]) + '"');
  }

  tag = '<' + name + (strAttr.length? ' ' + strAttr.join(' ') : '' ) + end;
  tag = content? (tag + content + '</' + name + end) : tag;
  return tag;
}

function end(name) {
  return '</' + name + '>';
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}
