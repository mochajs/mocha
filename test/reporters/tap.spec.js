'use strict';

var events = require('../../').Runner.constants;
var helpers = require('./helpers');
var reporters = require('../../').reporters;

var TAP = reporters.TAP;
var createMockRunner = helpers.createMockRunner;
var makeRunReporter = helpers.createRunReporterFunction;

var EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
var EVENT_RUN_END = events.EVENT_RUN_END;
var EVENT_TEST_END = events.EVENT_TEST_END;
var EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
var EVENT_TEST_PASS = events.EVENT_TEST_PASS;
var EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;
var EVENT_TEST_SKIPPED = events.EVENT_TEST_SKIPPED;

describe('TAP reporter', function() {
  var runReporter = makeRunReporter(TAP);
  var expectedTitle = 'some title';
  var countAfterTestEnd = 2;
  var noop = function() {};

  function createTest() {
    return {
      fullTitle: function() {
        return expectedTitle;
      },
      slow: noop
    };
  }

  describe('TAP12 spec', function() {
    var options = {
      reporterOptions: {
        tapVersion: '12'
      }
    };

    describe('event handlers', function() {
      describe("on 'start' event", function() {
        var expectedSuite = 'some suite';
        var expectedTotal = 10;
        var expectedString;
        var stdout = [];

        before(function() {
          var runner = createMockRunner('start', EVENT_RUN_BEGIN);
          runner.suite = expectedSuite;
          runner.grepTotal = function(string) {
            expectedString = string;
            return expectedTotal;
          };
          stdout = runReporter({}, runner, options);
        });

        it('should not write a TAP specification version', function() {
          expect(stdout, 'not to contain', 'TAP version');
        });

        it('should write the number of tests that it plans to run', function() {
          var expectedArray = ['1..' + expectedTotal + '\n'];
          expect(stdout, 'to equal', expectedArray);
          expect(expectedString, 'to be', expectedSuite);
        });
      });

      describe("on 'pending' event", function() {
        var stdout = [];

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PENDING,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'skipped' event", function() {
        var stdout = [];

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_SKIPPED,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'pass' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PASS,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'fail' event", function() {
        var expectedErrorMessage = 'some error';
        var expectedStack = 'some stack';

        describe("when 'error' has only message", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              message: expectedErrorMessage
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and error message', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedErrorMessage + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has only stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              stack: expectedStack
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and stack', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedStack + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has both message and stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              stack: expectedStack,
              message: expectedErrorMessage
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message, error message, and stack', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedErrorMessage + '\n',
              '  ' + expectedStack + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has neither message nor stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {};
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = runner.once = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message only', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe("on 'end' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'fail end pass',
            EVENT_TEST_FAIL,
            EVENT_RUN_END,
            EVENT_TEST_PASS,
            test
          );
          runner.stats.tests = 2;
          runner.stats.pending = 1;
          runner.stats.skipped = 1;
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write total tests, passes, skipped and failures', function() {
          var numberOfPasses = 1;
          var numberOfSkipped = 2;
          var numberOfFails = 1;
          var totalTests = numberOfPasses + numberOfFails;
          var expectedArray = [
            'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
            'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
            '# tests ' + totalTests + '\n',
            '# pass ' + numberOfPasses + '\n',
            '# skip ' + numberOfSkipped + '\n',
            '# fail ' + numberOfFails + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });
  });

  describe('TAP13 spec', function() {
    var options = {
      reporterOptions: {
        tapVersion: '13'
      }
    };

    describe('event handlers', function() {
      describe("on 'start' event", function() {
        var expectedSuite = 'some suite';
        var expectedTotal = 10;
        var expectedString;
        var stdout;

        before(function() {
          var runner = createMockRunner('start', EVENT_RUN_BEGIN);
          runner.suite = expectedSuite;
          runner.grepTotal = function(string) {
            expectedString = string;
            return expectedTotal;
          };
          stdout = runReporter({}, runner, options);
        });

        it('should write the TAP specification version', function() {
          var tapVersion = options.reporterOptions.tapVersion;
          var expectedFirstLine = 'TAP version ' + tapVersion + '\n';
          expect(stdout[0], 'to equal', expectedFirstLine);
        });

        it('should write the number of tests that it plans to run', function() {
          var expectedSecondLine = '1..' + expectedTotal + '\n';
          expect(stdout[1], 'to equal', expectedSecondLine);
          expect(expectedString, 'to be', expectedSuite);
        });
      });

      describe("on 'pending' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PENDING,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'skipped' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_SKIPPED,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'pass' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PASS,
            null,
            test
          );
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function() {
          var expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'fail' event", function() {
        var expectedErrorMessage = 'some error';
        var expectedStack = 'some stack';

        describe("when 'error' has only message", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              message: expectedErrorMessage
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and error message', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ---\n',
              '    message: |-\n',
              '      ' + expectedErrorMessage + '\n',
              '  ...\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has only stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              stack: expectedStack
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and stack', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ---\n',
              '    stack: |-\n',
              '      ' + expectedStack + '\n',
              '  ...\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has both message and stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {
              stack: expectedStack,
              message: expectedErrorMessage
            };
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message, error message, and stack', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ---\n',
              '    message: |-\n',
              '      ' + expectedErrorMessage + '\n',
              '    stack: |-\n',
              '      ' + expectedStack + '\n',
              '  ...\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has neither message nor stack", function() {
          var stdout;

          before(function() {
            var test = createTest();
            var error = {};
            var runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = runner.once = function(event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            runner.grepTotal = noop;
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message only', function() {
            var expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe("on 'end' event", function() {
        var stdout;

        before(function() {
          var test = createTest();
          var runner = createMockRunner(
            'fail end pass',
            EVENT_TEST_FAIL,
            EVENT_RUN_END,
            EVENT_TEST_PASS,
            test
          );
          runner.stats.tests = 2;
          runner.stats.pending = 1;
          runner.stats.skipped = 1;
          runner.suite = '';
          runner.grepTotal = noop;
          stdout = runReporter({}, runner, options);
        });

        it('should write total tests, passes, skipped and failures', function() {
          var numberOfPasses = 1;
          var numberOfSkipped = 2;
          var numberOfFails = 1;
          var totalTests = numberOfPasses + numberOfFails;
          var expectedArray = [
            'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
            'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
            '# tests ' + totalTests + '\n',
            '# pass ' + numberOfPasses + '\n',
            '# skip ' + numberOfSkipped + '\n',
            '# fail ' + numberOfFails + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });
  });
});
