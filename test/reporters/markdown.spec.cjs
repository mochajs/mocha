"use strict";

var events = require("../../").Runner.constants;
var helpers = require("./helpers.cjs");
var reporters = require("../../").reporters;

var Markdown = reporters.Markdown;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_SUITE_BEGIN = events.EVENT_SUITE_BEGIN;
var EVENT_SUITE_END = events.EVENT_SUITE_END;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;

describe("Markdown reporter", function () {
  var runReporter = makeRunReporter(Markdown);
  var expectedTitle = "expected title";
  var expectedFullTitle = "full title";
  var sluggedFullTitle = "full-title";
  var noop = function () {};

  describe("event handlers", function () {
    describe("on 'suite' event", function () {
      it("should write expected slugged titles on 'end' event", async function () {
        var expectedSuite = {
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
              suites: [],
            },
          ],
        };
        var runner = createMockRunner(
          "suite suite end",
          EVENT_SUITE_BEGIN,
          EVENT_SUITE_END,
          EVENT_RUN_END,
          expectedSuite,
        );
        runner.suite = expectedSuite;
        var options = {};
        var { stdout } = await runReporter({}, runner, options);

        var expectedArray = [
          "# TOC\n",
          " - [" +
            expectedTitle +
            "](#" +
            sluggedFullTitle +
            ")\n   - [" +
            expectedTitle +
            "](#" +
            sluggedFullTitle +
            ")\n",
          '<a name="' + sluggedFullTitle + '"></a>\n ' + expectedTitle + "\n",
        ];

        expect(stdout, "to equal", expectedArray);
      });
    });

    describe("on 'pass' event", function () {
      it("should write test code inside js code block, on 'end' event", async function () {
        var expectedSuite = {
          title: expectedTitle,
          fullTitle: function () {
            return expectedFullTitle;
          },
          suites: [],
        };
        var expectedDuration = 1000;
        var currentRetry = 1;
        var expectedBody = "some body";
        var expectedTest = {
          title: expectedTitle,
          fullTitle: function () {
            return expectedFullTitle;
          },
          duration: expectedDuration,
          currentRetry: function () {
            return currentRetry;
          },
          slow: noop,
          body: expectedBody,
        };
        var runner = createMockRunner(
          "pass end",
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          expectedTest,
        );
        runner.suite = expectedSuite;
        var options = {};
        var { stdout } = await runReporter({}, runner, options);

        var expectedArray = [
          "# TOC\n",
          " - [" + expectedTitle + "](#" + sluggedFullTitle + ")\n",
          expectedTitle + ".\n\n```js\n" + expectedBody + "\n```\n\n",
        ];

        expect(stdout, "to equal", expectedArray);
      });
    });

    describe("escaping markdown special characters", function () {
      it("should escape special characters in suite titles in the TOC and headings", async function () {
        var specialTitle = "*** [test] (#1)";
        var expectedSuite = {
          title: specialTitle,
          fullTitle: function () {
            return specialTitle;
          },
          suites: [],
        };
        var runner = createMockRunner(
          "suite suite end",
          EVENT_SUITE_BEGIN,
          EVENT_SUITE_END,
          EVENT_RUN_END,
          expectedSuite,
        );
        runner.suite = expectedSuite;
        var options = {};
        var { stdout } = await runReporter({}, runner, options);

        // The slug strips all non-word chars, so the anchor name is empty
        var slug = "";
        var escapedTitle = "\\*\\*\\* \\[test\\] \\(#1\\)";

        var expectedArray = [
          "# TOC\n",
          " - [" + escapedTitle + "](#" + slug + ")\n",
          '<a name="' + slug + '"></a>\n ' + escapedTitle + "\n",
        ];

        expect(stdout, "to equal", expectedArray);
      });

      it("should escape special characters in test titles", async function () {
        var specialTitle = ">>> should _work_ with *special* chars";
        var expectedSuite = {
          title: "suite",
          fullTitle: function () {
            return "suite";
          },
          suites: [],
        };
        var expectedBody = "some body";
        var expectedTest = {
          title: specialTitle,
          fullTitle: function () {
            return "suite " + specialTitle;
          },
          duration: 1000,
          currentRetry: function () {
            return 1;
          },
          slow: noop,
          body: expectedBody,
        };
        var runner = createMockRunner(
          "pass end",
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          expectedTest,
        );
        runner.suite = expectedSuite;
        var options = {};
        var { stdout } = await runReporter({}, runner, options);

        var escapedTitle =
          "\\>\\>\\> should \\_work\\_ with \\*special\\* chars";

        // Find the line that contains the test title (3rd element: the body output)
        var bodyOutput = stdout[2];
        expect(
          bodyOutput,
          "to contain",
          escapedTitle + ".\n\n```js\n" + expectedBody + "\n```\n\n",
        );
      });
    });
  });
});
