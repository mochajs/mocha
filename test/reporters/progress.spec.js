'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Base = reporters.Base;
const Progress = reporters.Progress;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_END = events.EVENT_TEST_END;

describe('Progress reporter', function () {
  const runReporter = makeRunReporter(Progress);
  const noop = function () {};

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    describe("on 'start' event", function () {
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
      describe('when line has changed', function () {
        it('should write expected progress of open and close options', function () {
          const crCursorStub = sinon.stub(Base.cursor, 'CR').callsFake(noop);
          sinon.stub(Base, 'useColors').value(false);
          sinon.stub(Base.window, 'width').value(5);

          const expectedTotal = 12;
          const expectedOpen = 'OpEn';
          const expectedClose = 'cLoSe';
          const expectedIncomplete = 'iNcOmPlEtE';
          const expectedOptions = {
            open: expectedOpen,
            complete: 'cOmPlEtE',
            incomplete: expectedIncomplete,
            close: expectedClose
          };

          const runner = createMockRunner('test end', EVENT_TEST_END);
          runner.total = expectedTotal;
          const options = {
            reporterOptions: expectedOptions
          };
          const stdout = runReporter({}, runner, options);
          sinon.restore();

          const expectedArray = [
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

      describe('when line has not changed', function () {
        it('should not write anything', function () {
          sinon.stub(Base, 'useColors').value(false);
          sinon.stub(Base.cursor, 'CR').callsFake(noop);
          sinon.stub(Base.window, 'width').value(-3);

          const expectedTotal = 1;
          const runner = createMockRunner('test end', EVENT_TEST_END);
          runner.total = expectedTotal;
          const options = {};
          const stdout = runReporter({}, runner, options);
          sinon.restore();

          expect(stdout, 'to equal', []);
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
