'use strict';

var reporters = require('../../').reporters;
var Markdown = reporters.Markdown;

var createMockRunner = require('./helpers').createMockRunner;

describe('Markdown reporter', function() {
  var stdout;
  var stdoutWrite;
  var runner;
  var expectedTitle = 'expected title';
  var expectedFullTitle = 'full title';
  var sluggedFullTitle = 'full-title';

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

  describe("on 'suite'", function() {
    it("should write expected slugged titles on 'end' event", function() {
      var expectedSuite = {
        title: expectedTitle,
        fullTitle: function() {
          return expectedFullTitle;
        },
        suites: [
          {
            title: expectedTitle,
            fullTitle: function() {
              return expectedFullTitle;
            },
            suites: []
          }
        ]
      };
      runner = createMockRunner(
        'suite suite end',
        'suite',
        'suite end',
        'end',
        expectedSuite
      );
      runner.suite = expectedSuite;
      Markdown.call({}, runner);
      process.stdout.write = stdoutWrite;

      var expectedArray = [
        '# TOC\n',
        ' - [' +
          expectedTitle +
          '](#' +
          sluggedFullTitle +
          ')\n   - [' +
          expectedTitle +
          '](#' +
          sluggedFullTitle +
          ')\n',
        '<a name="' + sluggedFullTitle + '"></a>\n ' + expectedTitle + '\n'
      ];

      expect(stdout, 'to equal', expectedArray);
    });
  });
  describe("on 'pass'", function() {
    it("should write test code inside js code block, on 'end' event", function() {
      var expectedSuite = {
        title: expectedTitle,
        fullTitle: function() {
          return expectedFullTitle;
        },
        suites: []
      };
      var expectedDuration = 1000;
      var currentRetry = 1;
      var expectedBody = 'some body';
      var expectedTest = {
        title: expectedTitle,
        fullTitle: function() {
          return expectedFullTitle;
        },
        duration: expectedDuration,
        currentRetry: function() {
          return currentRetry;
        },
        slow: function() {},
        body: expectedBody
      };
      runner = createMockRunner('pass end', 'pass', 'end', null, expectedTest);
      runner.suite = expectedSuite;
      Markdown.call({}, runner);
      process.stdout.write = stdoutWrite;

      var expectedArray = [
        '# TOC\n',
        ' - [' + expectedTitle + '](#' + sluggedFullTitle + ')\n',
        expectedTitle + '.\n\n```js\n' + expectedBody + '\n```\n\n'
      ];

      expect(stdout, 'to equal', expectedArray);
    });
  });
});
