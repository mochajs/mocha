'use strict';

var reporters = require('../../').reporters;
var TAP = reporters.TAP;

describe('TAP reporter', function () {
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

  describe('on start', function () {
    it('should hand runners suite into grepTotal and log the total', function () {
      var expectedSuite = 'some suite';
      var expectedTotal = 10;
      var expectedString;
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      runner.suite = expectedSuite;
      runner.grepTotal = function (string) {
        expectedString = string;
        return expectedTotal;
      };
      TAP.call({}, runner);

      var expectedArray = [
        '1..' + expectedTotal + '\n'
      ];
      process.stdout.write = stdoutWrite;

      expect(stdout).to.eql(expectedArray);
      expect(expectedString).to.equal(expectedSuite);
    });
  });

  describe('on pending', function () {
    it('should write expected message including count and title', function () {
      var expectedTitle = 'some title';
      var countAfterTestEnd = 2;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        }
      };
      runner.on = function (event, callback) {
        if (event === 'test end') {
          callback();
        }
        if (event === 'pending') {
          callback(test);
        }
      };
      runner.suite = '';
      runner.grepTotal = function () { };
      TAP.call({}, runner);

      process.stdout.write = stdoutWrite;

      var expectedMessage = 'ok ' + countAfterTestEnd + ' ' + expectedTitle + ' # SKIP -\n';
      expect(stdout[0]).to.eql(expectedMessage);
    });
  });

  describe('on pass', function () {
    it('should write expected message including count and title', function () {
      var expectedTitle = 'some title';
      var countAfterTestEnd = 2;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'test end') {
          callback();
        }
        if (event === 'pass') {
          callback(test);
        }
      };
      runner.suite = '';
      runner.grepTotal = function () { };
      TAP.call({}, runner);

      process.stdout.write = stdoutWrite;

      var expectedMessage = 'ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n';
      expect(stdout[0]).to.eql(expectedMessage);
    });
  });

  describe('on fail', function () {
    describe('if there is an error stack', function () {
      it('should write expected message and stack', function () {
        var expectedTitle = 'some title';
        var countAfterTestEnd = 2;
        var expectedStack = 'some stack';
        var test = {
          fullTitle: function () {
            return expectedTitle;
          },
          slow: function () {}
        };
        var error = {
          stack: expectedStack
        };
        runner.on = function (event, callback) {
          if (event === 'test end') {
            callback();
          }
          if (event === 'fail') {
            callback(test, error);
          }
        };
        runner.suite = '';
        runner.grepTotal = function () { };
        TAP.call({}, runner);

        process.stdout.write = stdoutWrite;

        var expectedArray = [
          'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n',
          '  ' + expectedStack + '\n'
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
    describe('if there is no error stack', function () {
      it('should write expected message only', function () {
        var expectedTitle = 'some title';
        var countAfterTestEnd = 2;
        var test = {
          fullTitle: function () {
            return expectedTitle;
          },
          slow: function () {}
        };
        var error = {};
        runner.on = function (event, callback) {
          if (event === 'test end') {
            callback();
          }
          if (event === 'fail') {
            callback(test, error);
          }
        };
        runner.suite = '';
        runner.grepTotal = function () { };
        TAP.call({}, runner);

        process.stdout.write = stdoutWrite;

        var expectedArray = [
          'not ok ' + countAfterTestEnd + ' ' + expectedTitle + '\n'
        ];
        expect(stdout).to.eql(expectedArray);
      });
    });
  });

  describe('on end', function () {
    it('should write total tests, passes and failures', function () {
      var expectedTitle = 'some title';
      var numberOfPasses = 1;
      var numberOfFails = 1;
      var test = {
        fullTitle: function () {
          return expectedTitle;
        },
        slow: function () {}
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test, {});
        }
        if (event === 'end') {
          callback(test);
        }
        if (event === 'pass') {
          callback(test);
        }
      };
      runner.suite = '';
      runner.grepTotal = function () { };
      TAP.call({}, runner);

      process.stdout.write = stdoutWrite;

      var totalTests = numberOfPasses + numberOfFails;
      var expectedArray = [
        'ok ' + numberOfPasses + ' ' + expectedTitle + '\n',
        'not ok ' + numberOfFails + ' ' + expectedTitle + '\n',
        '# tests ' + totalTests + '\n',
        '# pass ' + numberOfPasses + '\n',
        '# fail ' + numberOfFails + '\n'
      ];
      expect(stdout).to.eql(expectedArray);
    });
  });
});
