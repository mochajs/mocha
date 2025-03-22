'use strict';

var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var JSONStream = reporters.JSONStream;
var createMockRunner = helpers.createMockRunner;
var makeExpectedTest = helpers.makeExpectedTest;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;

describe('JSON Stream reporter', function () {
  var runReporter = makeRunReporter(JSONStream);
  var expectedTitle = 'some title';
  var expectedFullTitle = 'full title';
  var expectedFile = 'someTest.spec.js';
  var expectedDuration = 1000;
  var currentRetry = 1;
  var currentRepeat = 1;
  var expectedSpeed = 'fast';
  var expectedTest = makeExpectedTest(
    expectedTitle,
    expectedFullTitle,
    expectedFile,
    expectedDuration,
    currentRetry,
    currentRepeat,
    expectedSpeed
  );
  var expectedErrorMessage = 'error message';
  var expectedErrorStack = 'error stack';
  var expectedError = {
    message: expectedErrorMessage
  };

  describe('event handlers', function () {
    describe("on 'start' event", function () {
      it('should write stringified start with expected total', function () {
        var runner = createMockRunner('start', EVENT_RUN_BEGIN);
        var expectedTotal = 12;
        runner.total = expectedTotal;
        var options = {};
        var stdout = runReporter({}, runner, options);

        expect(
          stdout[0],
          'to equal',
          '["start",{"total":' + expectedTotal + '}]\n'
        );
      });
    });

    describe("on 'pass' event", function () {
      it('should write stringified test data', function () {
        var runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          expectedTest
        );
        var options = {};
        var stdout = runReporter({}, runner, options);

        expect(
          stdout[0],
          'to equal',
          '["pass",{"title":' +
            `"${expectedTitle}"` +
            ',"fullTitle":' +
            `"${expectedFullTitle}"` +
            ',"file":' +
            `"${expectedFile}"` +
            ',"duration":' +
            expectedDuration +
            ',"currentRetry":' +
            currentRetry +
            ',"currentRepeat":' +
            currentRepeat +
            ',"speed":' +
            `"${expectedSpeed}"` +
            '}]\n'
        );
      });
    });

    describe("on 'fail' event", function () {
      describe('when error stack exists', function () {
        it('should write stringified test data with error data', function () {
          expectedError.stack = expectedErrorStack;
          var runner = createMockRunner(
            'fail two args',
            EVENT_TEST_FAIL,
            null,
            null,
            expectedTest,
            expectedError
          );
          var options = {};
          var stdout = runReporter({}, runner, options);

          expect(
            stdout[0],
            'to equal',
            '["fail",{"title":' +
              `"${expectedTitle}"` +
              ',"fullTitle":' +
              `"${expectedFullTitle}"` +
              ',"file":' +
              `"${expectedFile}"` +
              ',"duration":' +
              expectedDuration +
              ',"currentRetry":' +
              currentRetry +
              ',"currentRepeat":' +
              currentRepeat +
              ',"speed":' +
              `"${expectedSpeed}"` +
              ',"err":' +
              `"${expectedErrorMessage}"` +
              ',"stack":' +
              `"${expectedErrorStack}"` +
              '}]\n'
          );
        });
      });

      describe('when error stack does not exist', function () {
        it('should write stringified test data with error data', function () {
          expectedError.stack = null;
          var runner = createMockRunner(
            'fail two args',
            EVENT_TEST_FAIL,
            null,
            null,
            expectedTest,
            expectedError
          );
          var options = {};
          var stdout = runReporter(this, runner, options);

          expect(
            stdout[0],
            'to equal',
            '["fail",{"title":' +
              `"${expectedTitle}"` +
              ',"fullTitle":' +
              `"${expectedFullTitle}"` +
              ',"file":' +
              `"${expectedFile}"` +
              ',"duration":' +
              expectedDuration +
              ',"currentRetry":' +
              currentRetry +
              ',"currentRepeat":' +
              currentRepeat +
              ',"speed":' +
              `"${expectedSpeed}"` +
              ',"err":' +
              `"${expectedErrorMessage}"` +
              ',"stack":null}]\n'
          );
        });
      });
    });

    describe("on 'end' event", function () {
      it('should write summary statistics', function () {
        var runner = createMockRunner('end', EVENT_RUN_END);
        var options = {};
        var stdout = runReporter(this, runner, options);
        expect(stdout[0], 'to match', /end/);
      });
    });
  });
});
