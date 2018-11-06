'use strict';

var reporters = require('../../').reporters;
var Landing = reporters.Landing;
var Base = reporters.Base;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('Landing reporter', function() {
  var runner;
  var options = {};
  var runReporter = makeRunReporter(Landing);
  var useColors;
  var windowWidth;
  var resetCode = '\u001b[0m';
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

  beforeEach(function() {
    useColors = Base.useColors;
    Base.useColors = false;
    windowWidth = Base.window.width;
    Base.window.width = 1;
  });

  afterEach(function() {
    Base.useColors = useColors;
    Base.window.width = windowWidth;
    runner = undefined;
  });

  describe('on start', function() {
    it('should write new lines', function() {
      var cachedCursor = Base.cursor;
      Base.cursor.hide = function() {};
      runner = createMockRunner('start', 'start');
      var stdout = runReporter({}, runner, options);

      expect(stdout[0], 'to equal', '\n\n\n  ');
      Base.cursor = cachedCursor;
    });

    it('should call cursor hide', function() {
      var cachedCursor = Base.cursor;
      var calledCursorHide = false;
      Base.cursor.hide = function() {
        calledCursorHide = true;
      };
      runner = createMockRunner('start', 'start');
      runReporter({}, runner, options);
      expect(calledCursorHide, 'to be', true);

      Base.cursor = cachedCursor;
    });
  });

  describe('on test end', function() {
    describe('if test has failed', function() {
      it('should write expected landing strip', function() {
        var test = {
          state: 'failed'
        };
        runner = createMockRunner('test end', 'test end', null, null, test);
        runner.total = 12;
        var stdout = runReporter({}, runner, options);

        expect(stdout, 'to equal', expectedArray);
      });
    });
    describe('if test has not failed', function() {
      it('should write expected landing strip', function() {
        var test = {
          state: 'success'
        };
        runner = createMockRunner('test end', 'test end', null, null, test);

        var stdout = runReporter({}, runner, options);

        expect(stdout, 'to equal', expectedArray);
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
      runReporter(
        {
          epilogue: function() {
            calledEpilogue = true;
          }
        },
        runner,
        options
      );

      expect(calledEpilogue, 'to be', true);
      expect(calledCursorShow, 'to be', true);

      Base.cursor = cachedCursor;
    });
  });
});
