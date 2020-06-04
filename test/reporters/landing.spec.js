'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;
var states = require('../../').Runnable.constants;

var Base = reporters.Base;
var Landing = reporters.Landing;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_END = events.EVENT_TEST_END;

var STATE_FAILED = states.STATE_FAILED;
var STATE_PASSED = states.STATE_PASSED;

describe('Landing reporter', function() {
  var runReporter = makeRunReporter(Landing);
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
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(Base.window, 'width').value(1);
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('event handlers', function() {
    describe("on 'start' event", function() {
      it('should write newlines', function() {
        sinon.stub(Base.cursor, 'hide');

        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        var stdout = runReporter({}, runner, options);
        sinon.restore();

        expect(stdout[0], 'to equal', '\n\n\n  ');
      });

      it('should call cursor hide', function() {
        var hideCursorStub = sinon.stub(Base.cursor, 'hide');

        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        runReporter({}, runner, options);
        sinon.restore();

        expect(hideCursorStub.called, 'to be true');
      });
    });

    describe("on 'test end' event", function() {
      describe('when test passes', function() {
        it('should write expected landing strip', function() {
          var test = {
            state: STATE_PASSED
          };
          var runner = createMockRunner(
            'test end',
            EVENT_TEST_END,
            null,
            null,
            test
          );
          var options = {};
          var stdout = runReporter({}, runner, options);
          sinon.restore();

          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when test fails', function() {
        it('should write expected landing strip', function() {
          var test = {
            state: STATE_FAILED
          };
          var runner = createMockRunner(
            'test end',
            EVENT_TEST_END,
            null,
            null,
            test
          );
          runner.total = 12;
          var options = {};
          var stdout = runReporter({}, runner, options);
          sinon.restore();

          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'end' event", function() {
      it('should call cursor show and epilogue', function() {
        var showCursorStub = sinon.stub(Base.cursor, 'show');

        var fakeThis = {
          epilogue: sinon.spy()
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(fakeThis.epilogue.calledOnce, 'to be true');
        expect(showCursorStub.called, 'to be true');
      });
    });
  });
});
