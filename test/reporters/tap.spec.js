'use strict';

const events = require('../../').Runner.constants;
const helpers = require('./helpers');
const reporters = require('../../').reporters;

const TAP = reporters.TAP;
const createMockRunner = helpers.createMockRunner;
const makeRunReporter = helpers.createRunReporterFunction;

const EVENT_RUN_BEGIN = events.EVENT_RUN_BEGIN;
const EVENT_RUN_END = events.EVENT_RUN_END;
const EVENT_TEST_END = events.EVENT_TEST_END;
const EVENT_TEST_FAIL = events.EVENT_TEST_FAIL;
const EVENT_TEST_PASS = events.EVENT_TEST_PASS;
const EVENT_TEST_PENDING = events.EVENT_TEST_PENDING;

describe('TAP reporter', function () {
  const runReporter = makeRunReporter(TAP);
  const expectedTitle = 'some title';
  const countAfterTestEnd = 2;
  const noop = function () {};

  function createTest () {
    return {
      fullTitle: function () {
        return expectedTitle;
      },
      slow: noop
    };
  }

  describe('TAP12 spec', function () {
    const options = {
      reporterOptions: {
        tapVersion: '12'
      }
    };

    describe('event handlers', function () {
      describe("on 'start' event", function () {
        const expectedSuite = 'some suite';
        let stdout = [];

        before(function () {
          const runner = createMockRunner('start', EVENT_RUN_BEGIN);
          runner.suite = expectedSuite;
          stdout = runReporter({}, runner, options);
        });

        it('should not write a TAP specification version', function () {
          expect(stdout, 'not to contain', 'TAP version');
        });
      });

      describe("on 'pending' event", function () {
        let stdout = [];

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PENDING,
            null,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function () {
          const expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'pass' event", function () {
        let stdout;

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PASS,
            null,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function () {
          const expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'fail' event", function () {
        const expectedErrorMessage = 'some error';
        const expectedStack = 'some stack';

        describe("when 'error' has only message", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              message: expectedErrorMessage
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and error message', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedErrorMessage + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has only stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              stack: expectedStack
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and stack', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedStack + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has both message and stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              stack: expectedStack,
              message: expectedErrorMessage
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message, error message, and stack', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ' + expectedErrorMessage + '\n',
              '  ' + expectedStack + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has neither message nor stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {};
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = runner.once = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message only', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe("on 'end' event", function () {
        let stdout;

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'fail end pass',
            EVENT_TEST_FAIL,
            EVENT_RUN_END,
            EVENT_TEST_PASS,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write total tests, passes, failures, & plan', function () {
          const numberOfPasses = 1;
          const numberOfFails = 1;
          const totalTests = numberOfPasses + numberOfFails;
          const expectedArray = [
            'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
            'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
            '# tests ' + totalTests + '\n',
            '# pass ' + numberOfPasses + '\n',
            '# fail ' + numberOfFails + '\n',
            '1..' + totalTests + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });
  });

  describe('TAP13 spec', function () {
    const options = {
      reporterOptions: {
        tapVersion: '13'
      }
    };

    describe('event handlers', function () {
      describe("on 'start' event", function () {
        const expectedSuite = 'some suite';
        let stdout;

        before(function () {
          const runner = createMockRunner('start', EVENT_RUN_BEGIN);
          runner.suite = expectedSuite;
          stdout = runReporter({}, runner, options);
        });

        it('should write the TAP specification version', function () {
          const tapVersion = options.reporterOptions.tapVersion;
          const expectedFirstLine = 'TAP version ' + tapVersion + '\n';
          expect(stdout[0], 'to equal', expectedFirstLine);
        });
      });

      describe("on 'pending' event", function () {
        let stdout;

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PENDING,
            null,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function () {
          const expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'pass' event", function () {
        let stdout;

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'start test',
            EVENT_TEST_END,
            EVENT_TEST_PASS,
            null,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write expected message including count and title', function () {
          const expectedMessage =
            'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
          expect(stdout[0], 'to equal', expectedMessage);
        });
      });

      describe("on 'fail' event", function () {
        const expectedErrorMessage = 'some error';
        const expectedStack = 'some stack';

        describe("when 'error' has only message", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              message: expectedErrorMessage
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and error message', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ---\n',
              '    message: |-\n',
              '      ' + expectedErrorMessage + '\n',
              '  ...\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has only stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              stack: expectedStack
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message and stack', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
              '  ---\n',
              '    stack: |-\n',
              '      ' + expectedStack + '\n',
              '  ...\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });

        describe("when 'error' has both message and stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {
              stack: expectedStack,
              message: expectedErrorMessage
            };
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message, error message, and stack', function () {
            const expectedArray = [
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

        describe("when 'error' has neither message nor stack", function () {
          let stdout;

          before(function () {
            const test = createTest();
            const error = {};
            const runner = createMockRunner(
              'test end fail',
              EVENT_TEST_END,
              EVENT_TEST_FAIL,
              null,
              test,
              error
            );
            runner.on = runner.once = function (event, callback) {
              if (event === EVENT_TEST_END) {
                callback();
              } else if (event === EVENT_TEST_FAIL) {
                callback(test, error);
              }
            };
            runner.suite = '';
            stdout = runReporter({}, runner, options);
          });

          it('should write expected message only', function () {
            const expectedArray = [
              'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
            ];
            expect(stdout, 'to equal', expectedArray);
          });
        });
      });

      describe("on 'end' event", function () {
        let stdout;

        before(function () {
          const test = createTest();
          const runner = createMockRunner(
            'fail end pass',
            EVENT_TEST_FAIL,
            EVENT_RUN_END,
            EVENT_TEST_PASS,
            test
          );
          runner.suite = '';
          stdout = runReporter({}, runner, options);
        });

        it('should write total tests, passes, failures & plan', function () {
          const numberOfPasses = 1;
          const numberOfFails = 1;
          const totalTests = numberOfPasses + numberOfFails;
          const expectedArray = [
            'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
            'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
            '# tests ' + totalTests + '\n',
            '# pass ' + numberOfPasses + '\n',
            '# fail ' + numberOfFails + '\n',
            '1..' + totalTests + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });
  });
});
