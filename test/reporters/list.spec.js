'use strict';

var reporters = require('../../').reporters;
var List = reporters.List;
var Base = reporters.Base;

describe('List reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function () {
    Base.useColors = useColors;
  });

  describe('on start and test', function () {
    it('should write expected new line and title to the console', function () {
      var expectedTitle = 'some title';
      var test = {
        fullTitle: function () {
          return expectedTitle;
        }
      };
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
        if (event === 'test') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;
      var startString = '\n';
      var testString = '    ' + expectedTitle + ': ';
      var expectedArray = [
        startString,
        testString
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on pending', function () {
    it('should write expected title to the console', function () {
      var expectedTitle = 'some title';
      var test = {
        fullTitle: function () {
          return expectedTitle;
        }
      };
      runner.on = function (event, callback) {
        if (event === 'pending') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('  - ' + expectedTitle + '\n');
    });
  });
  describe('on pass', function () {
    it('should call cursor CR', function () {
      var calledCursorCR = false;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function () {
        calledCursorCR = true;
      };
      var expectedTitle = 'some title';
      var expectedDuration = 100;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        duration: expectedDuration,
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'pass') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(calledCursorCR).to.be(true);

      Base.cursor = cachedCursor;
    });
    it('should write expected symbol, title and duration to the console', function () {
      var cachedSymbols = Base.symbols;
      var expectedOkSymbol = 'OK';
      Base.symbols.ok = expectedOkSymbol;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function () {};
      var expectedTitle = 'some title';
      var expectedDuration = 100;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        duration: expectedDuration,
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'pass') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.equal('  ' + expectedOkSymbol + ' ' + expectedTitle + ': ' + expectedDuration + 'ms\n');

      Base.cursor = cachedCursor;
      Base.symbols = cachedSymbols;
    });
  });
  describe('on fail', function () {
    it('should call cursor CR', function () {
      var calledCursorCR = false;
      var cachedCursor = Base.cursor;
      Base.cursor.CR = function () {
        calledCursorCR = true;
      };
      var expectedTitle = 'some title';
      var expectedDuration = 100;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        duration: expectedDuration,
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(calledCursorCR).to.be(true);

      Base.cursor = cachedCursor;
    });
    it('should write expected error number and title', function () {
      var cachedCursor = Base.cursor;
      var expectedErrorCount = 1;
      Base.cursor.CR = function () {};
      var expectedTitle = 'some title';
      var expectedDuration = 100;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        duration: expectedDuration,
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.equal('  ' + expectedErrorCount + ') ' + expectedTitle + '\n');

      Base.cursor = cachedCursor;
    });
    it('should immediately construct fail strings', function () {
      var actual = { a: 'actual' };
      var expected = { a: 'expected' };
      var test = {};
      var checked = false;
      var err;
      runner.on = function (event, callback) {
        if (!checked && event === 'fail') {
          err = new Error('fake failure object with actual/expected');
          err.actual = actual;
          err.expected = expected;
          err.showDiff = true;
          callback(test, err);
          checked = true;
        }
      };
      List.call({epilogue: function () {}}, runner);

      process.stdout.write = stdoutWrite;
      expect(typeof err.actual).to.equal('string');
      expect(typeof err.expected).to.equal('string');
    });
  });

  describe('on end', function () {
    it('should call epilogue', function () {
      var calledEpilogue = false;
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      List.call({
        epilogue: function () {
          calledEpilogue = true;
        }
      }, runner);
      process.stdout.write = stdoutWrite;

      expect(calledEpilogue).to.be(true);
    });
  });
});
