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
  });

  describe("'escapeSpecialCharacters' reporter option", function () {
    var expectedBody = "some body";

    function createSuite(title) {
      return {
        title,
        fullTitle: function () {
          return expectedFullTitle;
        },
        suites: [],
      };
    }

    function createTest(title) {
      return {
        title,
        fullTitle: function () {
          return expectedFullTitle;
        },
        duration: 1000,
        currentRetry: function () {
          return 1;
        },
        slow: noop,
        body: expectedBody,
      };
    }

    describe("when enabled", function () {
      var options = { reporterOptions: { escapeSpecialCharacters: true } };
      var specialCharacters = [
        "\\",
        "`",
        "*",
        "_",
        "{",
        "}",
        "[",
        "]",
        "(",
        ")",
        "#",
        "+",
        "-",
        ".",
        "!",
        "<",
        ">",
        "|",
      ];

      specialCharacters.forEach(function (character) {
        it(
          "should escape '" + character + "' in TOC and test titles",
          async function () {
            var title = "title with " + character + " character";
            var escapedTitle = "title with \\" + character + " character";
            var test = createTest(title);
            var runner = createMockRunner(
              "pass end",
              EVENT_TEST_PASS,
              EVENT_RUN_END,
              null,
              test,
            );
            runner.suite = createSuite(title);
            var { stdout } = await runReporter({}, runner, options);

            var expectedArray = [
              "# TOC\n",
              " - [" + escapedTitle + "](#" + sluggedFullTitle + ")\n",
              escapedTitle + ".\n\n```js\n" + expectedBody + "\n```\n\n",
            ];

            expect(stdout, "to equal", expectedArray);
          },
        );
      });

      it("should escape special characters in suite headings", async function () {
        var expectedSuite = createSuite("*** [markdown] `titles`");
        var runner = createMockRunner(
          "suite suite end",
          EVENT_SUITE_BEGIN,
          EVENT_SUITE_END,
          EVENT_RUN_END,
          expectedSuite,
        );
        runner.suite = expectedSuite;
        var { stdout } = await runReporter({}, runner, options);

        var escapedTitle = "\\*\\*\\* \\[markdown\\] \\`titles\\`";
        var expectedArray = [
          "# TOC\n",
          " - [" + escapedTitle + "](#" + sluggedFullTitle + ")\n",
          '<a name="' + sluggedFullTitle + '"></a>\n ' + escapedTitle + "\n",
        ];

        expect(stdout, "to equal", expectedArray);
      });
    });

    describe("when disabled", function () {
      it("should write titles verbatim", async function () {
        var title = "*** _title_ with `special` #characters";
        var test = createTest(title);
        var runner = createMockRunner(
          "pass end",
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          test,
        );
        runner.suite = createSuite(title);
        var { stdout } = await runReporter({}, runner, {});

        var expectedArray = [
          "# TOC\n",
          " - [" + title + "](#" + sluggedFullTitle + ")\n",
          title + ".\n\n```js\n" + expectedBody + "\n```\n\n",
        ];

        expect(stdout, "to equal", expectedArray);
      });
    });
  });
});
