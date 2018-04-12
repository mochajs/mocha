'use strict';

var reporters = require('../../').reporters;
var Progress = reporters.Progress;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;

describe('Progress reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
  });

  afterEach(function() {
    process.stdout.write = stdoutWrite;
  });

  describe('on start', function() {
    it('should call cursor hide', function() {
      var cachedCursor = Base.cursor;
      var calledCursorHide = false;
      Base.cursor.hide = function() {
        calledCursorHide = true;
      };
      runner = createMockRunner('start', 'start');
      Progress.call({}, runner);

      process.stdout.write = stdoutWrite;
      expect(calledCursorHide, 'to be', true);

      Base.cursor = cachedCursor;
    });
  });

  describe('on test end', function() {
    describe('if line has not changed', function() {
      it('should return and not write anything', function() {
        var cachedCursor = Base.cursor;
        var useColors = Base.useColors;
        Base.useColors = false;
        Base.cursor.CR = function() {};
        var windowWidth = Base.window.width;
        Base.window.width = -3;

        var expectedTotal = 1;
        var expectedOptions = {};
        runner = createMockRunner('test end', 'test end');
        runner.total = expectedTotal;
        Progress.call({}, runner, expectedOptions);

        process.stdout.write = stdoutWrite;

        expect(stdout, 'to equal', []);

        Base.cursor = cachedCursor;
        Base.useColors = useColors;
        Base.window.width = windowWidth;
      });
    });
    describe('if line has changed', function() {
      it('should write expected progress of open and close options', function() {
        var calledCursorCR = false;
        var cachedCursor = Base.cursor;
        var useColors = Base.useColors;
        Base.useColors = false;
        Base.cursor.CR = function() {
          calledCursorCR = true;
        };
        var windowWidth = Base.window.width;
        Base.window.width = 5;

        var expectedTotal = 12;
        var expectedOpen = 'OpEn';
        var expectedClose = 'cLoSe';
        var expectedIncomplete = 'iNcOmPlEtE';
        var expectedOptions = {
          open: expectedOpen,
          complete: 'cOmPlEtE',
          incomplete: expectedIncomplete,
          close: expectedClose
        };
        var options = {
          reporterOptions: expectedOptions
        };
        runner = createMockRunner('test end', 'test end');
        runner.total = expectedTotal;
        Progress.call({}, runner, options);

        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '\u001b[J',
          '  ' + expectedOpen,
          '',
          expectedIncomplete,
          expectedClose
        ];
        expect(calledCursorCR, 'to be', true);
        expect(stdout, 'to equal', expectedArray);

        Base.cursor = cachedCursor;
        Base.useColors = useColors;
        Base.window.width = windowWidth;
      });
    });
  });

  describe('on end', function() {
    it('should call cursor show and epilogue', function() {
      var cachedCursor = Base.cursor;
      var calledCursorShow = false;
      Base.cursor.show = function() {
        calledCursorShow = true;
      };
      runner = createMockRunner('end', 'end');
      var calledEpilogue = false;
      Progress.call(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner
      );

      process.stdout.write = stdoutWrite;
      expect(calledEpilogue, 'to be', true);
      expect(calledCursorShow, 'to be', true);

      Base.cursor = cachedCursor;
    });
  });
});
