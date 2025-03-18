'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Base = reporters.Base;
const Dot = reporters.Dot;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('Dot reporter', function () {
  let windowWidthStub;
  const runReporter = makeRunReporter(Dot);
  const noop = function () {};

  beforeEach(function () {
    windowWidthStub = sinon.stub(Base.window, 'width').value(0);
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(Base, 'color').callsFake(function (type, str) {
      return type.replace(/ /g, '-') + '_' + str;
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    describe("on 'start' event", function () {
      it('should write a newline', function () {
        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const options = {};
        const stdout = runReporter({epilogue: noop}, runner, options);
        sinon.restore();

        const expectedArray = ['\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function () {
      describe('when window width is greater than 1', function () {
        beforeEach(function () {
          windowWidthStub.value(2);
        });

        it('should write a newline followed by a comma', function () {
          const runner = createMockRunner('pending', EVENT_TEST_PENDING);
          const options = {};
          const stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          const expectedArray = ['\n  ', 'pending_' + Base.symbols.comma];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when window width is less than or equal to 1', function () {
        it('should write a comma', function () {
          const runner = createMockRunner('pending', EVENT_TEST_PENDING);
          const options = {};
          const stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          const expectedArray = ['pending_' + Base.symbols.comma];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'pass' event", function () {
      const test = {
        duration: 1,
        slow: function () {
          return 2;
        }
      };

      describe('when window width is greater than 1', function () {
        beforeEach(function () {
          windowWidthStub.value(2);
        });

        describe('when test speed is fast', function () {
          it('should write a newline followed by a dot', function () {
            const runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            const options = {};
            const stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'fast');
            const expectedArray = ['\n  ', 'fast_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe('when window width is less than or equal to 1', function () {
        describe('when test speed is fast', function () {
          it('should write a grey dot', function () {
            const runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            const options = {};
            const stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'fast');
            const expectedArray = ['fast_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe('when test speed is medium', function () {
          it('should write a yellow dot', function () {
            test.duration = 2;
            const runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            const options = {};
            const stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'medium');
            const expectedArray = ['medium_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe('when test speed is slow', function () {
          it('should write a bright yellow dot', function () {
            test.duration = 3;
            const runner = createMockRunner(
              'pass',
              EVENT_TEST_PASS,
              null,
              null,
              test
            );
            const options = {};
            const stdout = runReporter({epilogue: noop}, runner, options);
            sinon.restore();

            expect(test.speed, 'to equal', 'slow');
            const expectedArray = ['bright-yellow_' + Base.symbols.dot];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });
    });

    describe("on 'fail' event", function () {
      const test = {
        test: {
          err: 'some error'
        }
      };

      describe('when window width is greater than 1', function () {
        beforeEach(function () {
          windowWidthStub.value(2);
        });

        it('should write a newline followed by an exclamation mark', function () {
          const runner = createMockRunner(
            'fail',
            EVENT_TEST_FAIL,
            null,
            null,
            test
          );
          const options = {};
          const stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          const expectedArray = ['\n  ', 'fail_' + Base.symbols.bang];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('when window width is less than or equal to 1', function () {
        it('should write an exclamation mark', function () {
          const runner = createMockRunner(
            'fail',
            EVENT_TEST_FAIL,
            null,
            null,
            test
          );
          const options = {};
          const stdout = runReporter({epilogue: noop}, runner, options);
          sinon.restore();

          const expectedArray = ['fail_' + Base.symbols.bang];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe("on 'end' event", function () {
      it('should call epilogue', function () {
        const runner = createMockRunner('end', EVENT_RUN_END);
        const fakeThis = {
          epilogue: sinon.stub()
        };
        const options = {};
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(fakeThis.epilogue.called, 'to be true');
      });
    });
  });
});
