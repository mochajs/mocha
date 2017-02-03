'use strict';

var reporters = require('../../').reporters;
var Progress = reporters.Progress;
var Base = reporters.Base;

describe('Progrss reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on start', function () {
    it('should call cursor hide', function () {
      var cachedCursor = Base.cursor;
      var calledCursorHide = false;
      Base.cursor.hide = function () {
        calledCursorHide = true;
      };
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      Progress.call({}, runner);

      process.stdout.write = stdoutWrite;
      calledCursorHide.should.be.true();

      Base.cursor = cachedCursor;
    });
  });

  describe('on test end', function () {
    it('should write expected progress of open and close options', function () {
      var calledCursorCR = false;
      var cachedCursor = Base.cursor;
      var useColors = Base.useColors;
      Base.useColors = false;
      Base.cursor.CR = function () {
        calledCursorCR = true;
      };
      var windowWidth = Base.window.width;
      Base.window.width = 0;

      var expectedTotal = 12;
      var expectedOpen = 'OpEn';
      var expectedClose = 'cLoSe';
      var expectedOptions = {
        open: expectedOpen,
        complete: 'cOmPlEtE',
        incomplete: 'iNcOmPlEtE',
        close: expectedClose
      };
      runner.total = expectedTotal;
      runner.on = function (event, callback) {
        if (event === 'test end') {
          callback();
        }
      };
      Progress.call({}, runner, expectedOptions);

      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\u001b[J',
        '  ' + expectedOpen,
        '',
        '',
        expectedClose
      ];
      calledCursorCR.should.be.true();
      stdout.should.deepEqual(expectedArray);

      Base.cursor = cachedCursor;
      Base.useColors = useColors;
      Base.window.width = windowWidth;
    });
  });

  describe('on end', function () {
    it('should call cursor show and epilogue', function () {
      var cachedCursor = Base.cursor;
      var calledCursorShow = false;
      Base.cursor.show = function () {
        calledCursorShow = true;
      };
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      var calledEpilogue = false;
      Progress.call({
        epilogue: function () {
          calledEpilogue = true;
        }
      }, runner);

      process.stdout.write = stdoutWrite;
      calledEpilogue.should.be.true();
      calledCursorShow.should.be.true();

      Base.cursor = cachedCursor;
    });
  });
});
