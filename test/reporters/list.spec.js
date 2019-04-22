'use strict';

var sandbox = require('sinon').createSandbox();
var reporters = require('../../').reporters;
var List = reporters.List;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('List reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(List);
  var expectedTitle = 'some title';
  var expectedDuration = 100;
  var test = {
    fullTitle: function() {
      return expectedTitle;
    },
    duration: expectedDuration,
    slow: function() {}
  };

  beforeEach(function() {
    sandbox.stub(Base, 'useColors').value(false);
  });

  afterEach(function() {
    sandbox.restore();
    runner = undefined;
  });

  describe('on start and test', function() {
    it('should write expected new line and title to the console', function() {
      runner = createMockRunner('start test', 'start', 'test', null, test);
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      var startString = '\n';
      var testString = '    ' + expectedTitle + ': ';
      var expectedArray = [startString, testString];
      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe('on pending', function() {
    it('should write expected title to the console', function() {
      runner = createMockRunner('pending test', 'pending', null, null, test);
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      expect(stdout[0], 'to equal', '  - ' + expectedTitle + '\n');
    });
  });
  describe('on pass', function() {
    it('should call cursor CR', function() {
      sandbox.stub(Base.cursor, 'CR');

      runner = createMockRunner('pass', 'pass', null, null, test);
      runReporter({epilogue: function() {}}, runner, options);

      expect(Base.cursor.CR, 'was called');
    });
    it('should write expected symbol, title and duration to the console', function() {
      var expectedOkSymbol = 'OK';
      sandbox.stub(Base.symbols, 'ok').value(expectedOkSymbol);
      sandbox.stub(Base.cursor, 'CR');

      runner = createMockRunner('pass', 'pass', null, null, test);
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      expect(
        stdout[0],
        'to be',
        '  ' +
          expectedOkSymbol +
          ' ' +
          expectedTitle +
          ': ' +
          expectedDuration +
          'ms\n'
      );
    });
  });
  describe('on fail', function() {
    it('should call cursor CR', function() {
      sandbox.stub(Base.cursor, 'CR');

      runner = createMockRunner('fail', 'fail', null, null, test);
      runReporter({epilogue: function() {}}, runner, options);

      expect(Base.cursor.CR, 'was called');
    });
    it('should write expected error number and title', function() {
      sandbox.stub(Base.cursor, 'CR');

      var expectedErrorCount = 1;
      runner = createMockRunner('fail', 'fail', null, null, test);
      var stdout = runReporter({epilogue: function() {}}, runner, options);

      expect(
        stdout[0],
        'to be',
        '  ' + expectedErrorCount + ') ' + expectedTitle + '\n'
      );
    });
    it('should immediately construct fail strings', function() {
      var actual = {a: 'actual'};
      var expected = {a: 'expected'};
      var checked = false;
      var err;
      test = {};
      runner = createMockRunner('fail', 'fail', null, null, test);
      runner.on = runner.once = function(event, callback) {
        if (
          !checked &&
          event === 'fail' &&
          callback.toString().includes('stringifyDiffObjs') // target correct fail event callback
        ) {
          err = new Error('fake failure object with actual/expected');
          err.actual = actual;
          err.expected = expected;
          err.showDiff = true;
          callback(test, err);
          checked = true;
        }
      };
      runReporter({epilogue: function() {}}, runner, options);

      expect(typeof err.actual, 'to be', 'string');
      expect(typeof err.expected, 'to be', 'string');
    });
  });

  describe('on end', function() {
    it('should call epilogue', function() {
      var reporterStub = {epilogue: function() {}};
      sandbox.stub(reporterStub, 'epilogue');

      runner = createMockRunner('end', 'end');
      runReporter(reporterStub, runner, options);

      expect(reporterStub.epilogue, 'was called');
    });
  });
});
