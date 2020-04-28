'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Base = reporters.Base;
var List = reporters.List;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_BEGIN = events.EVENT_TEST_BEGIN;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;
var EVENT_TEST_SKIPPED = events.EVENT_TEST_SKIPPED;

describe('List reporter', function() {
  var sandbox;
  var runReporter = makeRunReporter(List);
  var expectedTitle = 'some title';
  var expectedDuration = 100;
  var noop = function() {};
  var test = {
    fullTitle: function() {
      return expectedTitle;
    },
    duration: expectedDuration,
    slow: noop
  };

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    sandbox.stub(Base, 'useColors').value(false);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('event handlers', function() {
    describe("on 'start' and 'test' events", function() {
      it('should write expected newline and title', function() {
        var runner = createMockRunner(
          'start test',
          EVENT_RUN_BEGIN,
          EVENT_TEST_BEGIN,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);
        sandbox.restore();

        var startString = '\n';
        var testString = '    ' + expectedTitle + ': ';
        var expectedArray = [startString, testString];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function() {
      it('should write expected title', function() {
        var runner = createMockRunner(
          'pending test',
          EVENT_TEST_PENDING,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(stdout[0], 'to equal', '  - ' + expectedTitle + '\n');
      });
    });

    describe("on 'skipped' event", function() {
      it('should write expected title', function() {
        var runner = createMockRunner(
          'skipped test',
          EVENT_TEST_SKIPPED,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(stdout[0], 'to equal', '  - ' + expectedTitle + '\n');
      });
    });

    describe("on 'pass' event", function() {
      var crStub;

      beforeEach(function() {
        crStub = sandbox.stub(Base.cursor, 'CR').callsFake(noop);
      });

      it('should call cursor CR', function() {
        var runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(crStub.called, 'to be true');
      });

      it('should write expected symbol, title, and duration', function() {
        var expectedOkSymbol = 'OK';
        sandbox.stub(Base.symbols, 'ok').value(expectedOkSymbol);

        var runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);
        sandbox.restore();

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

    describe("on 'fail' event", function() {
      var crStub;

      beforeEach(function() {
        crStub = sandbox.stub(Base.cursor, 'CR').callsFake(noop);
      });

      it('should call cursor CR', function() {
        var runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(crStub.called, 'to be true');
      });

      it('should write expected error number and title', function() {
        var expectedErrorCount = 1;
        var runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        var stdout = runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(
          stdout[0],
          'to be',
          '  ' + expectedErrorCount + ') ' + expectedTitle + '\n'
        );
      });

      it('should immediately construct fail strings', function() {
        var actual = {a: 'actual'};
        var expected = {a: 'expected'};
        var checked = false;
        var err;
        test = {};

        var runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        runner.on = runner.once = function(event, callback) {
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
        var options = {};
        var fakeThis = {
          epilogue: noop
        };
        runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(typeof err.actual, 'to be', 'string');
        expect(typeof err.expected, 'to be', 'string');
      });
    });

    describe("on 'end' event", function() {
      it('should call epilogue', function() {
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        var fakeThis = {
          epilogue: sinon.spy()
        };
        runReporter(fakeThis, runner, options);
        sandbox.restore();

        expect(fakeThis.epilogue.calledOnce, 'to be true');
      });
    });
  });
});
