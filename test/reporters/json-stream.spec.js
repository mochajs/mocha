'use strict';

const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const JSONStream = reporters.JSONStream;
const createMockRunner = helpers.createMockRunner;
const makeExpectedTest = helpers.makeExpectedTest;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;

describe('JSON Stream reporter', function () {
  const runReporter = makeRunReporter(JSONStream);
  const expectedTitle = 'some title';
  const expectedFullTitle = 'full title';
  const expectedFile = 'someTest.spec.js';
  const expectedDuration = 1000;
  const currentRetry = 1;
  const expectedSpeed = 'fast';
  const expectedTest = makeExpectedTest(
    expectedTitle,
    expectedFullTitle,
    expectedFile,
    expectedDuration,
    currentRetry,
    expectedSpeed
  );
  const expectedErrorMessage = 'error message';
  const expectedErrorStack = 'error stack';
  const expectedError = {
    message: expectedErrorMessage
  };

  describe('event handlers', function () {
    describe("on 'start' event", function () {
      it('should write stringified start with expected total', function () {
        const runner = createMockRunner('start', EVENT_RUN_BEGIN);
        const expectedTotal = 12;
        runner.total = expectedTotal;
        const options = {};
        const stdout = runReporter({}, runner, options);

        expect(
          stdout[0],
          'to equal',
          '["start",{"total":' + expectedTotal + '}]\n'
        );
      });
    });

    describe("on 'pass' event", function () {
      it('should write stringified test data', function () {
        const runner = createMockRunner(
          'pass',
          EVENT_TEST_PASS,
          null,
          null,
          expectedTest
        );
        const options = {};
        const stdout = runReporter({}, runner, options);

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
          const runner = createMockRunner(
            'fail two args',
            EVENT_TEST_FAIL,
            null,
            null,
            expectedTest,
            expectedError
          );
          const options = {};
          const stdout = runReporter({}, runner, options);

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
          const runner = createMockRunner(
            'fail two args',
            EVENT_TEST_FAIL,
            null,
            null,
            expectedTest,
            expectedError
          );
          const options = {};
          const stdout = runReporter(this, runner, options);

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
        const runner = createMockRunner('end', EVENT_RUN_END);
        const options = {};
        const stdout = runReporter(this, runner, options);
        expect(stdout[0], 'to match', /end/);
      });
    });
  });
});
