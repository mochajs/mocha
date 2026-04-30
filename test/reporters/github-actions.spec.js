"use strict";

var sinon = require("sinon");
var events = require("../../").Runner.constants;
var helpers = require("./helpers");
var reporters = require("../../").reporters;
var createStatsCollector =
  require("../../lib/stats-collector.mjs").createStatsCollector;

var Base = reporters.Base;
var GithubActions = reporters.GithubActions;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_RUN_END = events.EVENT_RUN_END;

/**
 * Creates a mock runner that fires EVENT_TEST_FAIL then EVENT_RUN_END
 * with proper error argument (unlike "fail end pass" which passes {}).
 */
function createFailEndRunner(test, err) {
  var handlers = {};
  var fn = function (event, callback) {
    if (!handlers[event]) {
      handlers[event] = [];
    }
    handlers[event].push(callback);
  };
  var mockRunner = { on: fn, once: fn };
  createStatsCollector(mockRunner);

  // Fire events asynchronously (matching afterTick pattern)
  Promise.resolve().then(function () {
    (handlers[EVENT_TEST_FAIL] || []).forEach(function (cb) {
      cb(test, err);
    });
    (handlers[EVENT_RUN_END] || []).forEach(function (cb) {
      cb();
    });
  });

  return mockRunner;
}

describe("GitHub Actions reporter", function () {
  var runReporter = makeRunReporter(GithubActions);
  var noop = function () {};

  beforeEach(function () {
    sinon.stub(Base, "useColors").value(false);
  });

  afterEach(function () {
    sinon.restore();
    delete process.env.GITHUB_STEP_SUMMARY;
  });

  it("should be exported as 'github-actions'", function () {
    expect(reporters["github-actions"], "to be", GithubActions);
  });

  it("should have a static description", function () {
    expect(GithubActions.description, "to be a", "string");
    expect(GithubActions.description, "not to be empty");
  });

  describe("event handlers", function () {
    describe("on 'fail' and 'end' events", function () {
      it("should emit ::error annotation for failures", async function () {
        var err = new Error("expected true to be false");
        err.stack =
          "Error: expected true to be false\n    at Context.<anonymous> (test/example.js:10:5)";
        var test = {
          title: "failing test",
          err: err,
        };
        var runner = createFailEndRunner(test, err);
        var options = {};
        var { stdout } = await runReporter({ epilogue: noop }, runner, options);
        sinon.restore();

        var output = stdout.join("");
        expect(output, "to contain", "::group::Mocha Annotations");
        expect(output, "to contain", "::error ");
        expect(output, "to contain", "file=test/example.js");
        expect(output, "to contain", "line=10");
        expect(output, "to contain", "col=5");
        expect(output, "to contain", "expected true to be false");
        expect(output, "to contain", "::endgroup::");
      });

      it("should handle errors without stack trace", async function () {
        var err = new Error("some error");
        err.stack = undefined;
        var test = {
          title: "failing test",
          err: err,
        };
        var runner = createFailEndRunner(test, err);
        var options = {};
        var { stdout } = await runReporter({ epilogue: noop }, runner, options);
        sinon.restore();

        var output = stdout.join("");
        expect(output, "to contain", "::error ");
        expect(output, "to contain", "some error");
      });

      it("should not emit annotations if no failures", async function () {
        var test = {
          title: "passing test",
          duration: 1,
          slow: function () {
            return 75;
          },
        };
        var runner = createMockRunner(
          "pass end",
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          test,
        );
        var options = {};
        var { stdout } = await runReporter({ epilogue: noop }, runner, options);
        sinon.restore();

        var output = stdout.join("");
        expect(output, "not to contain", "::group::");
        expect(output, "not to contain", "::error");
      });
    });

    describe("on 'end' event with GITHUB_STEP_SUMMARY", function () {
      it("should write job summary when env var is set", async function () {
        var fs = require("fs");
        var tmpFile = require("path").join(
          require("os").tmpdir(),
          "mocha-test-summary-" + Date.now() + ".md",
        );
        process.env.GITHUB_STEP_SUMMARY = tmpFile;

        var test = {
          title: "passing test",
          duration: 1,
          slow: function () {
            return 75;
          },
        };
        var runner = createMockRunner(
          "pass end",
          EVENT_TEST_PASS,
          EVENT_RUN_END,
          null,
          test,
        );
        runner.total = 1;
        var options = {};
        await runReporter(
          {
            epilogue: noop,
            stats: { passes: 1, failures: 0, pending: 0, duration: 100 },
          },
          runner,
          options,
        );
        sinon.restore();

        try {
          var content = fs.readFileSync(tmpFile, "utf8");
          expect(content, "to contain", "passing");
        } finally {
          try {
            fs.unlinkSync(tmpFile);
          } catch {
            // cleanup
          }
        }
      });
    });
  });

  describe("escaping", function () {
    it("should escape newlines and percent signs in error messages", async function () {
      var err = new Error("line1\nline2\n100% done");
      err.stack =
        "Error: line1\nline2\n    at Context.<anonymous> (test/file.js:1:1)";
      var test = {
        title: "failing test",
        err: err,
      };
      var runner = createFailEndRunner(test, err);
      var options = {};
      var { stdout } = await runReporter({ epilogue: noop }, runner, options);
      sinon.restore();

      var output = stdout.join("");
      // Newlines in the message should be escaped as %0A
      expect(output, "to contain", "%0A");
      // Percent signs should be escaped as %25
      expect(output, "to contain", "%25");
    });
  });
});
