'use strict';

var reporters = require('../../').reporters;
var JSONStream = reporters.JSONStream;

var createMockRunner = require('./helpers').createMockRunner;
var makeExpectedTest = require('./helpers').makeExpectedTest;

describe('Json Stream reporter', function() {
  var runner;
  var stdout;
  var stdoutWrite;

  var expectedTitle = 'some title';
  var expectedFullTitle = 'full title';
  var expectedDuration = 1000;
  var currentRetry = 1;
  var expectedTest = makeExpectedTest(
    expectedTitle,
    expectedFullTitle,
    expectedDuration,
    currentRetry
  );
  var expectedErrorMessage = 'error message';
  var expectedErrorStack = 'error stack';
  var expectedError = {
    message: expectedErrorMessage
  };

  beforeEach(function() {
    stdout = [];
    stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      stdoutWrite.call(process.stdout, string, enc, callback);
    };
  });

  afterEach(function() {
    process.stdout.write = stdoutWrite;
  });

  describe('on start', function() {
    it('should write stringified start with expected total', function() {
      runner = createMockRunner('start', 'start');
      var expectedTotal = 12;
      runner.total = expectedTotal;
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(
        stdout[0],
        'to equal',
        '["start",{"total":' + expectedTotal + '}]\n'
      );
    });
  });

  describe('on pass', function() {
    it('should write stringified test data', function() {
      runner = createMockRunner('pass', 'pass', null, null, expectedTest);
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(
        stdout[0],
        'to equal',
        '["pass",{"title":"' +
          expectedTitle +
          '","fullTitle":"' +
          expectedFullTitle +
          '","duration":' +
          expectedDuration +
          ',"currentRetry":' +
          currentRetry +
          '}]\n'
      );
    });
  });

  describe('on fail', function() {
    describe('if error stack exists', function() {
      it('should write stringified test data with error data', function() {
        expectedError.stack = expectedErrorStack;
        runner = createMockRunner(
          'fail two args',
          'fail',
          null,
          null,
          expectedTest,
          expectedError
        );

        JSONStream.call({}, runner);

        process.stdout.write = stdoutWrite;

        expect(
          stdout[0],
          'to equal',
          '["fail",{"title":"' +
            expectedTitle +
            '","fullTitle":"' +
            expectedFullTitle +
            '","duration":' +
            expectedDuration +
            ',"currentRetry":' +
            currentRetry +
            ',"err":"' +
            expectedErrorMessage +
            '","stack":"' +
            expectedErrorStack +
            '"}]\n'
        );
      });
    });

    describe('if error stack does not exist', function() {
      it('should write stringified test data with error data', function() {
        expectedError.stack = null;
        runner = createMockRunner(
          'fail two args',
          'fail',
          null,
          null,
          expectedTest,
          expectedError
        );

        JSONStream.call({}, runner);
        process.stdout.write = stdoutWrite;

        expect(
          stdout[0],
          'to equal',
          '["fail",{"title":"' +
            expectedTitle +
            '","fullTitle":"' +
            expectedFullTitle +
            '","duration":' +
            expectedDuration +
            ',"currentRetry":' +
            currentRetry +
            ',"err":"' +
            expectedErrorMessage +
            '","stack":null}]\n'
        );
      });
    });
  });

  describe('on end', function() {
    it('should write end details', function() {
      runner = createMockRunner('end', 'end');
      JSONStream.call({}, runner);
      process.stdout.write = stdoutWrite;
      expect(stdout[0], 'to match', /end/);
    });
  });
});
