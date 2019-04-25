'use strict';

var errors = require('../../lib/errors');
var createUnsupportedError = errors.createUnsupportedError;
/*
  This function prevents the constant use of creating a runnerEvent.
  runStr is the argument that defines the runnerEvent.
  ifStr1 is one possible reporter argument, as is ifStr2, and ifStr3
  arg1 and arg2 are the possible variables that need to be put into the
  scope of this function for the tests to run properly.
*/

var createStatsCollector = require('../../lib/stats-collector');

function createMockRunner(runStr, ifStr1, ifStr2, ifStr3, arg1, arg2) {
  var runnerFunction = createRunnerFunction(
    runStr,
    ifStr1,
    ifStr2,
    ifStr3,
    arg1,
    arg2
  );
  var mockRunner = {
    on: runnerFunction,
    once: runnerFunction
  };
  createStatsCollector(mockRunner);
  return mockRunner;
}

function createRunnerFunction(runStr, ifStr1, ifStr2, ifStr3, arg1, arg2) {
  var test = null;
  switch (runStr) {
    case 'start':
    case 'pending':
    case 'end':
      return function(event, callback) {
        if (event === ifStr1) {
          callback();
        }
      };
    case 'pending test':
    case 'pass':
    case 'fail':
    case 'suite':
    case 'suite end':
    case 'test end':
      test = arg1;
      return function(event, callback) {
        if (event === ifStr1) {
          callback(test);
        }
      };
    case 'fail two args':
      test = arg1;
      var expectedError = arg2;
      return function(event, callback) {
        if (event === ifStr1) {
          callback(test, expectedError);
        }
      };
    case 'start test':
      test = arg1;
      return function(event, callback) {
        if (event === ifStr1) {
          callback();
        }
        if (event === ifStr2) {
          callback(test);
        }
      };
    case 'suite suite end':
      var expectedSuite = arg1;
      return function(event, callback) {
        if (event === ifStr1) {
          callback(expectedSuite);
        }
        if (event === ifStr2) {
          callback();
        }
        if (event === ifStr3) {
          callback();
        }
      };
    case 'pass end':
      test = arg1;
      return function(event, callback) {
        if (event === ifStr1) {
          callback(test);
        }
        if (event === ifStr2) {
          callback();
        }
      };
    case 'test end fail':
      test = arg1;
      var error = arg2;
      return function(event, callback) {
        if (event === ifStr1) {
          callback();
        }
        if (event === ifStr2) {
          callback(test, error);
        }
      };
    case 'fail end pass':
      return function(event, callback) {
        test = arg1;
        if (event === ifStr1) {
          callback(test, {});
        }
        if (event === ifStr2) {
          callback(test);
        }
        if (event === ifStr3) {
          callback(test);
        }
      };
    default:
      throw createUnsupportedError(
        'This function does not support the runner string specified.'
      );
  }
}

function makeTest(err) {
  return {
    err: err,
    titlePath: function() {
      return ['test title'];
    }
  };
}

function createElements(argObj) {
  var res = [];
  for (var i = argObj.from; i <= argObj.to; i++) {
    res.push('element ' + i);
  }
  return res;
}

function makeExpectedTest(
  expectedTitle,
  expectedFullTitle,
  expectedDuration,
  currentRetry,
  expectedBody
) {
  return {
    title: expectedTitle,
    fullTitle: function() {
      return expectedFullTitle;
    },
    duration: expectedDuration,
    currentRetry: function() {
      return currentRetry;
    },
    slow: function() {}
  };
}

/**
 * Creates closure with reference to the reporter class constructor.
 *
 * @param {Function} ctor - Reporter class constructor
 * @return {createRunReporterFunction~runReporter}
 */
function createRunReporterFunction(ctor) {
  /**
   * Run reporter using stream reassignment to capture output.
   *
   * @param {Object} stubSelf - Reporter-like stub instance
   * @param {Runner} runner - Mock instance
   * @param {Object} [options] - Reporter configuration settings
   * @param {boolean} [tee=false] - Whether to echo output to screen
   * @return {string[]} Lines of output written to `stdout`
   */
  var runReporter = function(stubSelf, runner, options, tee) {
    var stdout = [];

    // Reassign stream in order to make a copy of all reporter output
    var stdoutWrite = process.stdout.write;
    process.stdout.write = function(string, enc, callback) {
      stdout.push(string);
      if (tee) {
        stdoutWrite.call(process.stdout, string, enc, callback);
      }
    };

    // Invoke reporter
    ctor.call(stubSelf, runner, options);

    // Revert stream reassignment here so reporter output
    // can't be corrupted if any test assertions throw
    process.stdout.write = stdoutWrite;

    return stdout;
  };

  return runReporter;
}

module.exports = {
  createElements: createElements,
  createMockRunner: createMockRunner,
  createRunReporterFunction: createRunReporterFunction,
  makeExpectedTest: makeExpectedTest,
  makeTest: makeTest
};
