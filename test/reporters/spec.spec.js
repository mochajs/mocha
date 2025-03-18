'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Base = reporters.Base;
const Spec = reporters.Spec;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_SUITE_BEGIN = events.EVENT_SUITE_BEGIN;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('Spec reporter', function () {
  const runReporter = makeRunReporter(Spec);
  const expectedTitle = 'expectedTitle';
  const noop = function () {};

  beforeEach(function () {
    sinon.stub(Base, 'useColors').value(false);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    describe("on 'suite' event", function () {
      it('should return title', function () {
        const suite = {
          title: expectedTitle
        };
        const runner = createMockRunner(
          'suite',
          EVENT_SUITE_BEGIN,
          null,
          null,
          suite
        );
        const options = {};
        const stdout = runReporter({epilogue: noop}, runner, options);
        sinon.restore();

        const expectedArray = [expectedTitle + '\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function () {
      it('should return title', function () {
        const suite = {
          title: expectedTitle
        };
        const runner = createMockRunner(
          'pending test',
          EVENT_TEST_PENDING,
          null,
          null,
          suite
        );
        const options = {};
        const stdout = runReporter({epilogue: noop}, runner, options);
        sinon.restore();

        const expectedArray = ['  - ' + expectedTitle + '\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pass' event", function () {
      describe('when test speed is slow', function () {
        it('should return expected tick, title, and duration', function () {
          const expectedDuration = 2;
          const test = {
            title: expectedTitle,
            duration: expectedDuration,
            slow: function () {
              return 1;
            }
          };
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

          const expectedString =
            '  ' +
            Base.symbols.ok +
            ' ' +
            expectedTitle +
            ' (' +
            expectedDuration +
            'ms)' +
            '\n';
          expect(stdout[0], 'to be', expectedString);
        });
      });

      describe('when test speed is fast', function () {
        it('should return expected tick, title without a duration', function () {
          const expectedDuration = 1;
          const test = {
            title: expectedTitle,
            duration: expectedDuration,
            slow: function () {
              return 2;
            }
          };
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

          const expectedString =
            '  ' + Base.symbols.ok + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to be', expectedString);
        });
      });
    });

    describe("on 'fail' event", function () {
      it('should return title and function count', function () {
        const functionCount = 1;
        const test = {
          title: expectedTitle
        };
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

        const expectedArray = [
          '  ' + functionCount + ') ' + expectedTitle + '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
});
