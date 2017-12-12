'use strict';

var reporters = require('../../').reporters;
var Markdown = reporters.Markdown;

describe('Markdown reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
  });

  describe('on \'suite\'', function () {
    it('should write expected slugged titles on \'end\' event', function () {
      var expectedTitle = 'expected title';
      var expectedFullTitle = 'full title';
      var sluggedFullTitle = 'full-title';
      var expectedSuite = {
        title: expectedTitle,
        fullTitle: function () { return expectedFullTitle; },
        suites: [{
          title: expectedTitle,
          fullTitle: function () { return expectedFullTitle; },
          suites: []
        }]
      };
      runner.on = function (event, callback) {
        if (event === 'suite') {
          callback(expectedSuite);
        }
        if (event === 'suite end') {
          callback();
        }
        if (event === 'end') {
          callback();
        }
      };
      runner.suite = expectedSuite;
      Markdown.call({}, runner);
      process.stdout.write = stdoutWrite;

      var expectedArray = [
        '# TOC\n',
        ' - [' + expectedTitle + '](#' + sluggedFullTitle + ')\n   - [' + expectedTitle + '](#' + sluggedFullTitle + ')\n',
        '<a name="' + sluggedFullTitle + '"></a>\n ' + expectedTitle + '\n'
      ];

      expect(stdout).to.eql(expectedArray);
    });
  });
  describe('on \'pass\'', function () {
    it('should write test code inside js code block, on \'end\' event', function () {
      var expectedTitle = 'expected title';
      var expectedFullTitle = 'full title';
      var sluggedFullTitle = 'full-title';
      var expectedSuite = {
        title: expectedTitle,
        fullTitle: function () { return expectedFullTitle; },
        suites: []
      };
      var expectedDuration = 1000;
      var currentRetry = 1;
      var expectedBody = 'some body';
      var expectedTest = {
        title: expectedTitle,
        fullTitle: function () { return expectedFullTitle; },
        duration: expectedDuration,
        currentRetry: function () { return currentRetry; },
        slow: function () {},
        body: expectedBody
      };
      runner.on = function (event, callback) {
        if (event === 'pass') {
          callback(expectedTest);
        }
        if (event === 'end') {
          callback();
        }
      };
      runner.suite = expectedSuite;
      Markdown.call({}, runner);
      process.stdout.write = stdoutWrite;

      var expectedArray = [
        '# TOC\n',
        ' - [' + expectedTitle + '](#' + sluggedFullTitle + ')\n',
        expectedTitle + '.\n\n```js\n' + expectedBody + '\n```\n\n'
      ];

      expect(stdout).to.eql(expectedArray);
    });
  });
});
