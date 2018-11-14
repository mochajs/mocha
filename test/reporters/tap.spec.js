'use strict';

var reporters = require('../../').reporters;
var TAP = reporters.TAP;

var createMockRunner = require('./helpers').createMockRunner;
var makeRunReporter = require('./helpers.js').createRunReporterFunction;

describe('TAP reporter', function() {
  var runner;
  var runReporter = makeRunReporter(TAP);
  var expectedTitle = 'some title';
  var countAfterTestEnd = 2;
  var test;

  beforeEach(function() {
    test = {
      fullTitle: function() {
        return expectedTitle;
      },
      slow: function() {}
    };
  });

  afterEach(function() {
    runner = undefined;
    test = undefined;
  });

  describe('TAP12 spec', function() {
    var options = {};

    describe('on start', function() {
      var expectedSuite = 'some suite';
      var expectedTotal = 10;
      var expectedString;
      var stdout;

      before(function() {
        runner = createMockRunner('start', 'start');
        runner.suite = expectedSuite;
        runner.grepTotal = function(string) {
          expectedString = string;
          return expectedTotal;
        };
        stdout = runReporter({}, runner, options);
      });

      it('should not write the TAP specification version', function() {
        expect(stdout, 'not to contain', 'TAP version');
      });
      it('should write the number of tests that it plans to run', function() {
        var expectedArray = ['1..' + expectedTotal + '\n'];
        expect(stdout, 'to equal', expectedArray);
        expect(expectedString, 'to be', expectedSuite);
      });
    });

    describe('on pending', function() {
      it('should write expected message including count and title', function() {
        runner = createMockRunner(
          'start test',
          'test end',
          'pending',
          null,
          test
        );
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var expectedMessage =
          'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
        expect(stdout[0], 'to equal', expectedMessage);
      });
    });

    describe('on pass', function() {
      it('should write expected message including count and title', function() {
        runner = createMockRunner('start test', 'test end', 'pass', null, test);
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var expectedMessage =
          'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
        expect(stdout[0], 'to equal', expectedMessage);
      });
    });

    describe('on fail', function() {
      describe('if there is an error message', function() {
        it('should write expected message and error message', function() {
          var expectedErrorMessage = 'some error';
          var error = {
            message: expectedErrorMessage
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

          var expectedArray = [
            'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
            '  ' + expectedErrorMessage + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('if there is an error stack', function() {
        it('should write expected message and stack', function() {
          var expectedStack = 'some stack';
          var error = {
            stack: expectedStack
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

          var expectedArray = [
            'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
            '  ' + expectedStack + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('if there is an error stack and error message', function() {
        it('should write expected message and stack', function() {
          var expectedStack = 'some stack';
          var expectedErrorMessage = 'some error';
          var error = {
            stack: expectedStack,
            message: expectedErrorMessage
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

          var expectedArray = [
            'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
            '  ' + expectedErrorMessage + '\n',
            '  ' + expectedStack + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });

      describe('if there is no error stack or error message', function() {
        it('should write expected message only', function() {
          var error = {};
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = runner.once = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

          var expectedArray = [
            'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe('on end', function() {
      it('should write total tests, passes and failures', function() {
        var numberOfPasses = 1;
        var numberOfFails = 1;
        runner = createMockRunner('fail end pass', 'fail', 'end', 'pass', test);
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var totalTests = numberOfPasses + numberOfFails;
        var expectedArray = [
          'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
          'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
          '# tests ' + totalTests + '\n',
          '# pass ' + numberOfPasses + '\n',
          '# fail ' + numberOfFails + '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });

  describe('TAP13 spec', function() {
    var options = {
      reporterOptions: {
        tapVersion: '13'
      }
    };

    describe('on start', function() {
      var expectedSuite = 'some suite';
      var expectedTotal = 10;
      var expectedString;
      var stdout;

      before(function() {
        runner = createMockRunner('start', 'start');
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

    describe('on pending', function() {
      it('should write expected message including count and title', function() {
        runner = createMockRunner(
          'start test',
          'test end',
          'pending',
          null,
          test
        );
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var expectedMessage =
          'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
        expect(stdout[0], 'to equal', expectedMessage);
      });
    });

    describe('on pass', function() {
      it('should write expected message including count and title', function() {
        runner = createMockRunner('start test', 'test end', 'pass', null, test);
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var expectedMessage =
          'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
        expect(stdout[0], 'to equal', expectedMessage);
      });
    });

    describe('on fail', function() {
      describe('if there is an error message', function() {
        it('should write expected message and error message', function() {
          var expectedErrorMessage = 'some error';
          var error = {
            message: expectedErrorMessage
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

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

      describe('if there is an error stack', function() {
        it('should write expected message and stack', function() {
          var expectedStack = 'some stack';
          var error = {
            stack: expectedStack
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

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

      describe('if there is an error stack and error message', function() {
        it('should write expected message and stack', function() {
          var expectedStack = 'some stack';
          var expectedErrorMessage = 'some error';
          var error = {
            stack: expectedStack,
            message: expectedErrorMessage
          };
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

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

      describe('if there is no error stack or error message', function() {
        it('should write expected message only', function() {
          var error = {};
          runner = createMockRunner(
            'test end fail',
            'test end',
            'fail',
            null,
            test,
            error
          );
          runner.on = runner.once = function(event, callback) {
            if (event === 'test end') {
              callback();
            } else if (event === 'fail') {
              callback(test, error);
            }
          };
          runner.suite = '';
          runner.grepTotal = function() {};

          var stdout = runReporter({}, runner, options);

          var expectedArray = [
            'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
          ];
          expect(stdout, 'to equal', expectedArray);
        });
      });
    });

    describe('on end', function() {
      it('should write total tests, passes and failures', function() {
        var numberOfPasses = 1;
        var numberOfFails = 1;
        runner = createMockRunner('fail end pass', 'fail', 'end', 'pass', test);
        runner.suite = '';
        runner.grepTotal = function() {};

        var stdout = runReporter({}, runner, options);

        var totalTests = numberOfPasses + numberOfFails;
        var expectedArray = [
          'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
          'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
          '# tests ' + totalTests + '\n',
          '# pass ' + numberOfPasses + '\n',
          '# fail ' + numberOfFails + '\n'
        ];
        expect(stdout, 'to equal', expectedArray);
      });
    });
  });
});
