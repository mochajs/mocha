'use strict';

var reporters = require('../../').reporters;
var JSONStream = reporters.JSONStream;

describe('Json Stream reporter', function () {
  var runner;
  var stdout;
  var stdoutWrite;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on start', function () {
    it('should write stringified start with expected total', function () {
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      var expectedTotal = 12;
      runner.total = expectedTotal;
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('["start",{"total":' + expectedTotal + '}]\n');
    });
  });

  describe('on pass', function () {
    it('should write stringified test data', function () {
      var expectedTitle = 'some title';
      var expectedFullTitle = 'full title';
      var expectedDuration = 1000;
      var currentRetry = 1;
      var expectedTest = {
        title: expectedTitle,
        fullTitle: function () { return expectedFullTitle; },
        duration: expectedDuration,
        currentRetry: function () { return currentRetry; },
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'pass') {
          callback(expectedTest);
        }
      };
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.eql('["pass",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + '}]\n');
    });
  });

  describe('on fail', function () {
    describe('if error stack exists', function () {
      it('should write stringified test data with error data', function () {
        var expectedTitle = 'some title';
        var expectedFullTitle = 'full title';
        var expectedDuration = 1000;
        var currentRetry = 1;
        var expectedTest = {
          title: expectedTitle,
          fullTitle: function () { return expectedFullTitle; },
          duration: expectedDuration,
          currentRetry: function () { return currentRetry; },
          slow: function () {}
        };
        var expectedErrorMessage = 'error message';
        var expectedErrorStack = 'error stack';
        var expectedError = {
          message: expectedErrorMessage,
          stack: expectedErrorStack
        };
        runner.on = function (event, callback) {
          if (event === 'fail') {
            callback(expectedTest, expectedError);
          }
        };
        JSONStream.call({}, runner);

        process.stdout.write = stdoutWrite;

        expect(stdout[0]).to.eql('["fail",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + ',"err":"' + expectedErrorMessage + '","stack":"' + expectedErrorStack + '"}]\n');
      });
    });
    describe('if error stack does not exist', function () {
      it('should write stringified test data with error data', function () {
        var expectedTitle = 'some title';
        var expectedFullTitle = 'full title';
        var expectedDuration = 1000;
        var currentRetry = 1;
        var expectedTest = {
          title: expectedTitle,
          fullTitle: function () { return expectedFullTitle; },
          duration: expectedDuration,
          currentRetry: function () { return currentRetry; },
          slow: function () {}
        };
        var expectedErrorMessage = 'error message';
        var expectedError = {
          message: expectedErrorMessage
        };
        runner.on = function (event, callback) {
          if (event === 'fail') {
            callback(expectedTest, expectedError);
          }
        };
        JSONStream.call({}, runner);

        process.stdout.write = stdoutWrite;

        expect(stdout[0]).to.eql('["fail",{"title":"' + expectedTitle + '","fullTitle":"' + expectedFullTitle + '","duration":' + expectedDuration + ',"currentRetry":' + currentRetry + ',"err":"' + expectedErrorMessage + '","stack":null}]\n');
      });
    });
  });

  describe('on end', function () {
    it('should write end details', function () {
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      JSONStream.call({}, runner);

      process.stdout.write = stdoutWrite;

      expect(stdout[0]).to.match(/end/);
    });
  });
});
