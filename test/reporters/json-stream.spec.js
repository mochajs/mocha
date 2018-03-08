'use strict';

var reporters = require('../../').reporters;
var JSONStream = reporters.JSONStream;

var runnerEvent = require('./helpers').runnerEvent;
var makeExpectedTest = require('./helpers').makeExpectedTest;

describe('Json Stream reporter', function () {
  var runner;
  var stdout;
  var stdoutWrite;

  var expectedTitle;
  var expectedFullTitle;
  var expectedDuration;
  var currentRetry;
  var expectedTest;
  var expectedErrorMessage;
  var expectedErrorStack;
  var expectedError;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };

    expectedTitle = 'some title';
    expectedFullTitle = 'full title';
    expectedDuration = 1000;
    currentRetry = 1;
    expectedTest = makeExpectedTest(expectedTitle, expectedFullTitle, expectedDuration, currentRetry);
    expectedErrorMessage = 'error message';
    expectedErrorStack = 'error stack';
    expectedError = {
      message: expectedErrorMessage
    };
  });

  describe('on start', function () {
    it('should write stringified start with expected total', function () {
      runner.on = runner.once = runnerEvent('start', 'start');
      var expectedTotal = 12;
      runner.total = expectedTotal;
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('["start",{"total":' + expectedTotal + '}]\n');
    });
  });

  describe('on pass', function () {
    it('should write stringified test data', function () {
      runner.on = runner.once = runnerEvent('pass', 'pass', null, null, expectedTest);
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('["pass",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + '}]\n');
    });
  });

  describe('on fail', function () {
    describe('if error stack exists', function () {
      it('should write stringified test data with error data', function () {
        expectedError.stack = expectedErrorStack;
        runner.on = runner.once = runnerEvent('fail two args', 'fail', null, null, expectedTest, expectedError);

        JSONStream.call({}, runner);

        process.stdout.write = stdoutWrite;

        expect(stdout[0]).to.eql('["fail",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + ',"err":"' + expectedErrorMessage + '","stack":"' + expectedErrorStack + '"}]\n');
      });
    });

    describe('if error stack does not exist', function () {
      it('should write stringified test data with error data', function () {
        expectedError.stack = null;
        runner.on = runner.once = runnerEvent('fail two args', 'fail', null, null, expectedTest, expectedError);

        JSONStream.call({}, runner);
        process.stdout.write = stdoutWrite;

        expect(stdout[0]).to.eql('["fail",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + ',"err":"' + expectedErrorMessage + '","stack":null}]\n');
      });
    });
  });

  describe('on end', function () {
    it('should write end details', function () {
      runner.on = runner.once = runnerEvent('end', 'end');
      JSONStream.call({}, runner);
      process.stdout.write = stdoutWrite;
      expect(stdout[0]).to.match(/end/);
    });
  });
});
