'use strict';

var reporters = require('../../').reporters;
var Landing = reporters.Landing;
var Base = reporters.Base;

describe('Landing reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;
  var windowWidth;
  var resetCode = '\u001b[0m';

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
    windowWidth = Base.window.width;
    Base.window.width = 1;
  });

  afterEach(function () {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
  });

  describe('on start', function () {
    it('should write new lines', function () {
      var cachedCursor = Base.cursor;
      Base.cursor.hide = function () {};
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      Landing.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('\n\n\n  ');
      Base.cursor = cachedCursor;
    });

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
      Landing.call({}, runner);

      process.stdout.write = stdoutWrite;
      expect(calledCursorHide).to.be(true);

      Base.cursor = cachedCursor;
    });
  });

  describe('on test end', function () {
    describe('if test has failed', function () {
      it('should write expected landing strip', function () {
        var test = {
          state: 'failed'
        };
        runner.on = function (event, callback) {
          if (event === 'test end') {
            callback(test);
          }
        };
        runner.total = 12;
        Landing.call({}, runner);

        process.stdout.write = stdoutWrite;

        var expectedArray = [
          '\u001b[1D\u001b[2A',
          '  ',
          '\n  ',
          '',
          '✈',
          '\n',
          '  ',
          resetCode
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if test has not failed', function () {
      it('should write expected landing strip', function () {
        var test = {
          state: 'success'
        };
        runner.on = function (event, callback) {
          if (event === 'test end') {
            callback(test);
          }
        };

        Landing.call({}, runner);

        process.stdout.write = stdoutWrite;

        var expectedArray = [
          '\u001b[1D\u001b[2A',
          '  ',
          '\n  ',
          '',
          '✈',
          '\n',
          '  ',
          resetCode
        ];
        expect(stdout).to.eql(expectedArray);
      });
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
      Landing.call({
        epilogue: function () {
          calledEpilogue = true;
        }
      }, runner);

      process.stdout.write = stdoutWrite;
      expect(calledEpilogue).to.be(true);
      expect(calledCursorShow).to.be(true);

      Base.cursor = cachedCursor;
    });
  });
});
