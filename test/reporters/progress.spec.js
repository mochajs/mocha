'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Base = reporters.Base;
var Progress = reporters.Progress;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_END = events.EVENT_TEST_END;

describe('Progress reporter', function() {
  var sandbox;
  var runReporter = makeRunReporter(Progress);
  var noop = function() {};

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('event handlers', function() {
    describe("on 'start' event", function() {
      it('should call cursor hide', function() {
        var hideCursorStub = sandbox.stub(Base.cursor, 'hide');

        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var options = {};
        runReporter({}, runner, options);
        sandbox.restore();

        expect(hideCursorStub.called, 'to be true');
      });
    });

    describe("on 'test end' event", function() {
      describe('when line has changed', function() {
        it('should write expected progress of open and close options', function() {
          var crCursorStub = sandbox.stub(Base.cursor, 'CR').callsFake(noop);
          sandbox.stub(Base, 'useColors').value(false);
          sandbox.stub(Base.window, 'width').value(5);

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

          var runner = createMockRunner('test end', EVENT_TEST_END);
          runner.total = expectedTotal;
          var options = {
            reporterOptions: expectedOptions
          };
          var stdout = runReporter({}, runner, options);
          sandbox.restore();

          var expectedArray = [
            '\u001b[J',
            '  ' + expectedOpen,
            '',
            expectedIncomplete,
            expectedClose
          ];

          expect(crCursorStub.called, 'to be true');
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when line has not changed', function() {
        it('should not write anything', function() {
          sandbox.stub(Base, 'useColors').value(false);
          sandbox.stub(Base.cursor, 'CR').callsFake(noop);
          sandbox.stub(Base.window, 'width').value(-3);

          var expectedTotal = 1;
          var runner = createMockRunner('test end', EVENT_TEST_END);
          runner.total = expectedTotal;
          var options = {};
          var stdout = runReporter({}, runner, options);
          sandbox.restore();

          expect(stdout, 'to equal', []);
        });
      });
    });

    describe("on 'end' event", function() {
      it('should call cursor show and epilogue', function() {
        var showCursorStub = sandbox.stub(Base.cursor, 'show');
        var fakeThis = {
          epilogue: sinon.spy()
        };
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(fakeThis.epilogue.calledOnce, 'to be true');
        expect(showCursorStub.called, 'to be true');
      });
    });
  });
});
