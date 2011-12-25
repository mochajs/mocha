var repl = require("repl");
var Base = require('./base');
var sys  = require('sys');

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
    time: test.duration
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
  return tag('skipped', { message: encode(test.err.stack || test.err) }, true);
}

function failedTestTag(test) {
  var str = test.err;

  // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
  // check for the result of the stringifying.
  if ('[object Error]' == str) str = test.err.message;
  
  var attributes = { message: encode(str) };
  return tag('failure', attributes, false, cdata(test.err.stack));
}

function encode(value) {
  return !value ? value :
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/\u001b\[\d{1,2}m/g, '');
}

function tag(name, attribs, single, content) {
  var tag;
  var end = single ? ' />' : '>'
  var strAttr = [];
  for (var attr in attribs) {
    attribs.hasOwnProperty(attr) && strAttr.push(attr + '="' + encode(attribs[attr]) + '"');
  }

  tag = '<' + name + (strAttr.length? ' ' + strAttr.join(' ') : '' ) + end;
  tag = content? (tag + content + '</' + name + end) : tag;
  return tag;
}

function end(name) {
  return '</' + name + '>';
}

function cdata(data) {
  return '<![CDATA[' + encode(data) + ']]>';
}

XUnit.prototype.__proto__ = Base.prototype;
