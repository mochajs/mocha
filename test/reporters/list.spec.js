'use strict';

var reporters = require('../../').reporters;
var List = reporters.List;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;

describe('List reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
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
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function() {
    Base.useColors = useColors;
    process.stdout.write = stdoutWrite;
  });

  describe('on start and test', function() {
    it('should write expected new line and title to the console', function() {
      runner = createMockRunner('start test', 'start', 'test', null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;
      var startString = '\n';
      var testString = '    ' + expectedTitle + ': ';
      var expectedArray = [startString, testString];
      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe('on pending', function() {
    it('should write expected title to the console', function() {
      runner = createMockRunner('pending test', 'pending', null, null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0], 'to equal', '  - ' + expectedTitle + '\n');
    });
  });
  describe('on pass', function() {
    it('should call cursor CR', function() {
      var calledCursorCR = false;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function() {
        calledCursorCR = true;
      };
      runner = createMockRunner('pass', 'pass', null, null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(calledCursorCR, 'to be', true);

      Base.cursor = cachedCursor;
    });
    it('should write expected symbol, title and duration to the console', function() {
      var cachedSymbols = Base.symbols;
      var expectedOkSymbol = 'OK';
      Base.symbols.ok = expectedOkSymbol;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function() {};
      runner = createMockRunner('pass', 'pass', null, null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;

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

      Base.cursor = cachedCursor;
      Base.symbols = cachedSymbols;
    });
  });
  describe('on fail', function() {
    it('should call cursor CR', function() {
      var calledCursorCR = false;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function() {
        calledCursorCR = true;
      };
      runner = createMockRunner('fail', 'fail', null, null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(calledCursorCR, 'to be', true);

      Base.cursor = cachedCursor;
    });
    it('should write expected error number and title', function() {
      var cachedCursor = Base.cursor;
      var expectedErrorCount = 1;
      Base.cursor.CR = function() {};
      runner = createMockRunner('fail', 'fail', null, null, test);
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(
        stdout[0],
        'to be',
        '  ' + expectedErrorCount + ') ' + expectedTitle + '\n'
      );

      Base.cursor = cachedCursor;
    });
    it('should immediately construct fail strings', function() {
      var actual = {a: 'actual'};
      var expected = {a: 'expected'};
      var checked = false;
      var err;
      test = {};
      runner.on = runner.once = function(event, callback) {
        if (!checked && event === 'fail') {
          err = new Error('fake failure object with actual/expected');
          err.actual = actual;
          err.expected = expected;
          err.showDiff = true;
          callback(test, err);
          checked = true;
        }
      };
      List.call({epilogue: function() {}}, runner);

      process.stdout.write = stdoutWrite;
      expect(typeof err.actual, 'to be', 'string');
      expect(typeof err.expected, 'to be', 'string');
    });
  });

  describe('on end', function() {
    it('should call epilogue', function() {
      var calledEpilogue = false;
      runner = createMockRunner('end', 'end');
      List.call(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner
      );
      process.stdout.write = stdoutWrite;

      expect(calledEpilogue, 'to be', true);
    });
  });
});
