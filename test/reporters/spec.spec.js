'use strict';

var sinon = require('sinon');
var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var Base = reporters.Base;
var Spec = reporters.Spec;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_SUITE_BEGIN = events.EVENT_SUITE_BEGIN;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;
var EVENT_TEST_SKIPPED = events.EVENT_TEST_SKIPPED;

describe('Spec reporter', function() {
  var runReporter = makeRunReporter(Spec);
  var expectedTitle = 'expectedTitle';
  var noop = function() {};
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    sandbox.stub(Base, 'useColors').value(false);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('event handlers', function() {
    describe("on 'suite' event", function() {
      it('should return title', function() {
        var suite = {
          title: expectedTitle
        };
        var runner = createMockRunner(
          'suite',
          EVENT_SUITE_BEGIN,
          null,
          null,
          suite
        );
        var options = {};
        var stdout = runReporter({epilogue: noop}, runner, options);
        sandbox.restore();

        var expectedArray = [expectedTitle + '\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pending' event", function() {
      it('should return title', function() {
        var suite = {
          title: expectedTitle
        };
        var runner = createMockRunner(
          'pending test',
          EVENT_TEST_PENDING,
          null,
          null,
          suite
        );
        var options = {};
        var stdout = runReporter({epilogue: noop}, runner, options);
        sandbox.restore();

        var expectedArray = ['  - ' + expectedTitle + '\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'skipped' event", function() {
      it('should return title', function() {
        var suite = {
          title: expectedTitle
        };
        var runner = createMockRunner(
          'skipped test',
          EVENT_TEST_SKIPPED,
          null,
          null,
          suite
        );
        var options = {};
        var stdout = runReporter({epilogue: noop}, runner, options);
        sandbox.restore();

        var expectedArray = ['  - ' + expectedTitle + '\n'];
        expect(stdout, 'to equal', expectedArray);
      });
    });

    describe("on 'pass' event", function() {
      describe('when test speed is slow', function() {
        it('should return expected tick, title, and duration', function() {
          var expectedDuration = 2;
          var test = {
            title: expectedTitle,
            duration: expectedDuration,
            slow: function() {
              return 1;
            }
          };
          var runner = createMockRunner(
            'pass',
            EVENT_TEST_PASS,
            null,
            null,
            test
          );
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sandbox.restore();

          var expectedString =
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

      describe('when test speed is fast', function() {
        it('should return expected tick, title without a duration', function() {
          var expectedDuration = 1;
          var test = {
            title: expectedTitle,
            duration: expectedDuration,
            slow: function() {
              return 2;
            }
          };
          var runner = createMockRunner(
            'pass',
            EVENT_TEST_PASS,
            null,
            null,
            test
          );
          var options = {};
          var stdout = runReporter({epilogue: noop}, runner, options);
          sandbox.restore();

          var expectedString =
            '  ' + Base.symbols.ok + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to be', expectedString);
        });
      });
    });

    describe("on 'fail' event", function() {
      it('should return title and function count', function() {
        var functionCount = 1;
        var test = {
          title: expectedTitle
        };
        var runner = createMockRunner(
          'fail',
          EVENT_TEST_FAIL,
          null,
          null,
          test
        );
        var options = {};
        var stdout = runReporter({epilogue: noop}, runner, options);
        sandbox.restore();

        var expectedArray = [
          '  ' + functionCount + ') ' + expectedTitle + '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
});
