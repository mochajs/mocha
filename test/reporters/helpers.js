'use strict';

/*
  This function prevents the constant use of creating a runnerEvent.
  runStr is the argument that defines the runnerEvent.
  ifStr1 is one possible reporter argument, as is ifStr2, and ifStr3
  arg1 and arg2 are the possible variables that need to be put into the
  scope of this function for the tests to run properly.
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
  return {
    on: runnerFunction,
    once: runnerFunction
  };
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
      throw new Error(
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

module.exports = {
  createMockRunner: createMockRunner,
  makeTest: makeTest,
  createElements: createElements,
  makeExpectedTest: makeExpectedTest
};
