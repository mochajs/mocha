'use strict';

const sinon = require('sinon');
const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Base = reporters.Base;
const List = reporters.List;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_BEGIN = events.EVENT_TEST_BEGIN;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('List reporter', function () {
  const runReporter = makeRunReporter(List);
  const expectedTitle = 'some title';
  const expectedDuration = 100;
  const noop = function () {};
  let test = {
    fullTitle: function () {
      return expectedTitle;
    },
    duration: expectedDuration,
    slow: noop
  };

  beforeEach(function () {
    sinon.stub(Base, 'useColors').value(false);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('event handlers', function () {
    describe("on 'start' and 'test' events", function () {
      it('should write expected newline and title', function () {
        const runner = createMockRunner(
          'start test',
          EVENT_RUN_BEGIN,
          EVENT_TEST_BEGIN,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        const stdout = runReporter(fakeThis, runner, options);
        sinon.restore();

        const startString = '\n';
        const testString = '    ' + expectedTitle + ': ';
        const expectedArray = [startString, testString];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function () {
      it('should write expected title', function () {
        const runner = createMockRunner(
          'pending test',
          EVENT_TEST_PENDING,
          null,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        const stdout = runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(stdout[0], 'to equal', '  - ' + expectedTitle + '\n');
      });
    });

    describe("on 'pass' event", function () {
      let crStub;

      beforeEach(function () {
        crStub = sinon.stub(Base.cursor, 'CR').callsFake(noop);
      });

      it('should call cursor CR', function () {
        const runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(crStub.called, 'to be true');
      });

      it('should write expected symbol, title, and duration', function () {
        const expectedOkSymbol = 'OK';
        sinon.stub(Base.symbols, 'ok').value(expectedOkSymbol);

        const runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        const stdout = runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(
          stdout[0],
          'to be',
          '  ' +
            expectedOkSymbol +
            ' ' +
            expectedTitle +
            ': ' +
            expectedDuration +
            'ms\n'
        );
      });
    });

    describe("on 'fail' event", function () {
      let crStub;

      beforeEach(function () {
        crStub = sinon.stub(Base.cursor, 'CR').callsFake(noop);
      });

      it('should call cursor CR', function () {
        const runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(crStub.called, 'to be true');
      });

      it('should write expected error number and title', function () {
        const expectedErrorCount = 1;
        const runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        const stdout = runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(
          stdout[0],
          'to be',
          '  ' + expectedErrorCount + ') ' + expectedTitle + '\n'
        );
      });

      it('should immediately construct fail strings', function () {
        const actual = {a: 'actual'};
        const expected = {a: 'expected'};
        let checked = false;
        let err;
        test = {};

        const runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        runner.on = runner.once = function (event, callback) {
          if (
            !checked &&
            event === 'fail' &&
            callback.toString().includes('stringifyDiffObjs') // target correct fail event callback
          ) {
            err = new Error('fake failure object with actual/expected');
            err.actual = actual;
            err.expected = expected;
            err.showDiff = true;
            callback(test, err);
            checked = true;
          }
        };
        const options = {};
        const fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(typeof err.actual, 'to be', 'string');
        expect(typeof err.expected, 'to be', 'string');
      });
    });

    describe("on 'end' event", function () {
      it('should call epilogue', function () {
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        const fakeThis = {
          epilogue: sinon.spy()
        };
        runReporter(fakeThis, runner, options);
        sinon.restore();

        expect(fakeThis.epilogue.calledOnce, 'to be true');
      });
    });
  });
});
