'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;
const states = require('../../').Runnable.constants;

const Base = reporters.Base;
const Landing = reporters.Landing;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_END = events.EVENT_TEST_END;

const STATE_FAILED = states.STATE_FAILED;
const STATE_PASSED = states.STATE_PASSED;

describe('Landing reporter', function () {
  const runReporter = makeRunReporter(Landing);
  const resetCode = '\u001b[0m';
  const expectedArray = [
    '\u001b[1D\u001b[2A',
    '  ',
    '\n  ',
    '',
    '✈',
    '\n',
    '  ',
    resetCode
  ];

  beforeEach(function () {
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(Base.window, 'width').value(1);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    describe("on 'start' event", function () {
      it('should write newlines', function () {
        sinon.stub(Base.cursor, 'hide');

        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const options = {};
        const stdout = runReporter({}, runner, options);
        sinon.restore();

        expect(stdout[0], 'to equal', '\n\n\n  ');
      });

      it('should call cursor hide', function () {
        const hideCursorStub = sinon.stub(Base.cursor, 'hide');

        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const options = {};
        runReporter({}, runner, options);
        sinon.restore();

        expect(hideCursorStub.called, 'to be true');
      });
    });

    describe("on 'test end' event", function () {
      describe('when test passes', function () {
        it('should write expected landing strip', function () {
          const test = {
            state: STATE_PASSED
          };
          const runner = createMockRunner(
            'test end',
            EVENT_TEST_END,
            null,
            null,
            test
          );
          const options = {};
          const stdout = runReporter({}, runner, options);
          sinon.restore();

          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when test fails', function () {
        it('should write expected landing strip', function () {
          const test = {
            state: STATE_FAILED
          };
          const runner = createMockRunner(
            'test end',
            EVENT_TEST_END,
            null,
            null,
            test
          );
          runner.total = 12;
          const options = {};
          const stdout = runReporter({}, runner, options);
          sinon.restore();

          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'end' event", function () {
      it('should call cursor show and epilogue', function () {
        const showCursorStub = sinon.stub(Base.cursor, 'show');

        const fakeThis = {
          epilogue: sinon.spy()
        };
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(fakeThis.epilogue.calledOnce, 'to be true');
        expect(showCursorStub.called, 'to be true');
      });
    });
  });
});
