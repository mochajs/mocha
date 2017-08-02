'use strict';

var Mocha = require('../../');
var TAP = require('../../lib/reporters/tap');
var stackTraceFilter = require('../../lib/utils').stackTraceFilter();
var Suite = Mocha.Suite;
var Runner = Mocha.Runner;
var Test = Mocha.Test;

describe('tap reporter', function () {
  var suite;
  var runner;
  var mochaReporter;
  var log;
  var consoleLog;

  /**
   * Takes the stack and pads the beginning
   * to match formatted error stack.
   */
  function formatStack (stack) {
    return stack.split('\n').map(function (s) {
      return '  ' + s;
    }).join('\n');
  }

  beforeEach(function () {
    var mocha = new Mocha({
      reporter: 'tap'
    });
    suite = new Suite('TAP suite', 'root');
    runner = new Runner(suite);
    mochaReporter = new mocha._reporter(runner);
  });

  beforeEach(function () {
    log = [];
    consoleLog = console.log;
    console.log = function (string) {
      log.push(string);
    };
  });

  afterEach(function () {
    console.log = consoleLog;
  });

  it('should match output for one suite', function (done) {
    var testTitle = 'tap test 1';
    var output = [
      '1..1',
      '# TAP suite',
      'ok 1 ' + testTitle,
      '# tests 1',
      '# pass 1',
      '# fail 0'
    ];

    suite.addTest(new Test(testTitle, function (done) {
      done();
    }));

    runner.run(function () {
      mochaReporter.should.be.an.instanceof(TAP);
      log.should.be.an.Array;
      log.join('\n').should.match(output.join('\n'));
      done();
    });
  });

  it('should concatenate a child suite to a suite\'s title', function (done) {
    var testTitle = 'tap test 2';
    var childSuite = new Suite('Another suite', suite);
    var output = [
      '1..1',
      '# TAP suite Another suite',
      'ok 1 ' + testTitle,
      '# tests 1',
      '# pass 1',
      '# fail 0'
    ];

    suite.addSuite(childSuite);
    childSuite.addTest(new Test(testTitle, function (done) {
      done();
    }));

    runner.run(function () {
      mochaReporter.should.be.an.instanceof(TAP);
      log.should.be.an.Array;
      log.join('\n').should.equal(output.join('\n'));
      done();
    });
  });

  it('should show a stack trace following not ok test lines', function (done) {
    var testTitle = 'tap test 3';
    var err = new Error('fail');
    var output = [
      '1..1',
      '# TAP suite',
      'not ok 1 ' + testTitle,
      formatStack(stackTraceFilter(err.stack)),
      '# tests 1',
      '# pass 0',
      '# fail 1'
    ];

    suite.addTest(new Test(testTitle, function (done) {
      done(err);
    }));

    runner.run(function () {
      log.join('\n').should.equal(output.join('\n'));
      done();
    });
  });
});
