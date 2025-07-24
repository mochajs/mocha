'use strict';

var sinon = require('sinon');
var errors = require('../../lib/errors');
var createStatsCollector = require('../../lib/stats-collector');

var createUnsupportedError = errors.createUnsupportedError;

/**
 * Creates a mock runner object.
 *
 * @param {string} runStr - argument that defines the runnerEvent
 * @param {string} ifStr1 - runner event
 * @param {(string|null)} [ifStr2] - runner event
 * @param {(string|null)} [ifStr3] - runner event
 * @param {(*|null)} [arg1] - variable to be added to event handler's scope
 * @param {(*|null)} [arg2] - variable to be added to event handler's scope
 * @return {Object} mock runner instance
 */
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

/**
 * Creates an event handler function to be used by the runner.
 *
 * @description
 * Arguments 'ifStr1', 'ifStr2', and 'ifStr3' should be `Runner.constants`.
 *
 * @param {string} runStr - argument that defines the runnerEvent
 * @param {string} ifStr1 - runner event
 * @param {(string|null)} [ifStr2] - runner event
 * @param {(string|null)} [ifStr3] - runner event
 * @param {(*|null)} [arg1] - variable to be added to event handler's scope
 * @param {(*|null)} [arg2] - variable to be added to event handler's scope
 * @return {Function} event handler for the requested runner events
 */
function createRunnerFunction(runStr, ifStr1, ifStr2, ifStr3, arg1, arg2) {
  var test = null;
  switch (runStr) {
    case 'start':
    case 'pending':
    case 'end':
      return function (event, callback) {
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
      return function (event, callback) {
        if (event === ifStr1) {
          callback(test);
        }
      };
    case 'fail two args':
      test = arg1;
      var expectedError = arg2;
      return function (event, callback) {
        if (event === ifStr1) {
          callback(test, expectedError);
        }
      };
    case 'start test':
      test = arg1;
      return function (event, callback) {
        if (event === ifStr1) {
          callback();
        }
        if (event === ifStr2) {
          callback(test);
        }
      };
    case 'suite suite end':
      var expectedSuite = arg1;
      return function (event, callback) {
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
      return function (event, callback) {
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
      return function (event, callback) {
        if (event === ifStr1) {
          callback();
        }
        if (event === ifStr2) {
          callback(test, error);
        }
      };
    case 'fail end pass':
      return function (event, callback) {
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
    err,
    titlePath: function () {
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
  expectedFile,
  expectedDuration,
  currentRetry
) {
  return {
    title: expectedTitle,
    fullTitle: function () {
      return expectedFullTitle;
    },
    file: expectedFile,
    duration: expectedDuration,
    currentRetry: function () {
      return currentRetry;
    },
    slow: function () {}
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
  var runReporter = function (stubSelf, runner, options, tee) {
    var origStdoutWrite = process.stdout.write;
    var stdoutWriteStub = sinon.stub(process.stdout, 'write');
    var stdout = [];

    var gather = function (chunk) {
      stdout.push(chunk);
      if (tee) {
        origStdoutWrite.call(process.stdout, chunk);
      }
    };

    // Reassign stream in order to make a copy of all reporter output
    stdoutWriteStub.callsFake(gather);

    // Give `stubSelf` access to `ctor` prototype chain
    Object.setPrototypeOf(stubSelf, ctor.prototype);

    try {
      // Invoke reporter
      ctor.call(stubSelf, runner, options);
    } finally {
      // Revert stream reassignment here so reporter output
      // can't be corrupted if any test assertions throw
      stdoutWriteStub.restore();
    }

    return stdout;
  };

  return runReporter;
}

module.exports = {
  createElements,
  createMockRunner,
  createRunReporterFunction,
  makeExpectedTest,
  makeTest
};
