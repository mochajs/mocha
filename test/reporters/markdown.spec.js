'use strict';

const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const Markdown = reporters.Markdown;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_SUITE_BEGIN = events.EVENT_SUITE_BEGIN;
const EVENT_SUITE_END = events.EVENT_SUITE_END;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;

describe('Markdown reporter', function () {
  const runReporter = makeRunReporter(Markdown);
  const expectedTitle = 'expected title';
  const expectedFullTitle = 'full title';
  const sluggedFullTitle = 'full-title';
  const noop = function () {};

  describe('event handlers', function () {
    describe("on 'suite' event", function () {
      it("should write expected slugged titles on 'end' event", function () {
        const expectedSuite = {
          title: expectedTitle,
          fullTitle: function () {
            return expectedFullTitle;
          },
          suites: [
            {
              title: expectedTitle,
              fullTitle: function () {
                return expectedFullTitle;
              },
              suites: []
            }
          ]
        };
        const runner = createMockRunner(
          'suite suite end',
          EVENT_SUITE_BEGIN,
          EVENT_SUITE_END,
          EVENT_RUN_END,
          expectedSuite
        );
        runner.suite = expectedSuite;
        const options = {};
        const stdout = runReporter({}, runner, options);

        const expectedArray = [
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

    describe("on 'pass' event", function () {
      it("should write test code inside js code block, on 'end' event", function () {
        const expectedSuite = {
          title: expectedTitle,
          fullTitle: function () {
            return expectedFullTitle;
          },
          suites: []
        };
        const expectedDuration = 1000;
        const currentRetry = 1;
        const expectedBody = 'some body';
        const expectedTest = {
          title: expectedTitle,
          fullTitle: function () {
            return expectedFullTitle;
          },
          duration: expectedDuration,
          currentRetry: function () {
            return currentRetry;
          },
          slow: noop,
          body: expectedBody
        };
        const runner = createMockRunner(
          'pass end',
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          expectedTest
        );
        runner.suite = expectedSuite;
        const options = {};
        const stdout = runReporter({}, runner, options);

        const expectedArray = [
          '# TOC\n',
          ' - [' + expectedTitle + '](#' + sluggedFullTitle + ')\n',
          expectedTitle + '.\n\n```js\n' + expectedBody + '\n```\n\n'
        ];

        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
});
