var Base = require('./base');
var utils = require('../utils');

/**
 * Expose `XUnit`.
 */

exports = module.exports = XUnit;

function XUnit(runner) {
  Base.call(this, runner);
  var stats = this.stats;
  var tests = [];
  var self = this;

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

    var _i, _len;
    for (_i = 0; _len = tests.length, _i < _len; _i++) {
      processTest(tests[_i]);
    }
    
    console.error(end('testsuite'));    
  });
}

function processTest(test) {
  var attributes = {
    classname: test.fullTitle(),
    name: test.title,
    time: test.duration / 1000.0
  };

  if (test.failed) {
    console.error( tag('testcase', attributes, false, failedTestTag(test)) );
  } else if (test.pending) {
    console.error( tag('testcase', attributes, false, pendingTestTag(test)) );
  } else {
    console.error( tag('testcase', attributes, true) );
  }
}

function pendingTestTag(test) {
  return tag('skipped', { message: utils.escape(test.err.stack || test.err) }, true);
}

function failedTestTag(test) {
  var str = test.err;

  // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
  // check for the result of the stringifying.
  if ('[object Error]' == str) str = test.err.message;
  
  var attributes = { message: utils.escape(str) };
  return tag('failure', attributes, false, cdata(test.err.stack));
}

function tag(name, attribs, single, content) {
  var tag;
  var end = single ? ' />' : '>'
  var strAttr = [];
  for (var attr in attribs) {
    attribs.hasOwnProperty(attr) && strAttr.push(attr + '="' + utils.escape(attribs[attr]) + '"');
  }

  tag = '<' + name + (strAttr.length? ' ' + strAttr.join(' ') : '' ) + end;
  tag = content? (tag + content + '</' + name + end) : tag;
  return tag;
}

function end(name) {
  return '</' + name + '>';
}

function cdata(data) {
  return '<![CDATA[' + utils.escape(data) + ']]>';
}

XUnit.prototype.__proto__ = Base.prototype;
