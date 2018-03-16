'use strict';

/*
  This function prevents the constant use of creating a runnerEvent.
  runStr is the argument that solely defines the runnerEvent.
  ifStr1 is one possible reporter argument, as is ifStr2, and ifStr3
  arg1 and arg2 are the possible variables that need to be put into the scope of this function for the tests to run properly.
*/
function runnerEvent (runStr, ifStr1, ifStr2, ifStr3, arg1, arg2) {
  var test = null;
  if (runStr === 'start' || runStr === 'pending' || runStr === 'end') {
    return function (event, callback) {
      if (event === ifStr1) {
        callback();
      }
    };
  } else if (
    runStr === 'pending test' ||
    runStr === 'pass' ||
    runStr === 'fail' ||
    runStr === 'end' ||
    runStr === 'suite' ||
    runStr === 'suite end' ||
    runStr === 'test end'
  ) {
    test = arg1;
    return function (event, callback) {
      if (event === ifStr1) {
        callback(test);
      }
    };
  } else if (runStr === 'fail two args') {
    test = arg1;
    var expectedError = arg2;
    return function (event, callback) {
      if (event === ifStr1) {
        callback(test, expectedError);
      }
    };
  } else if (runStr === 'start test') {
    test = arg1;
    return function (event, callback) {
      if (event === ifStr1) {
        callback();
      }
      if (event === ifStr2) {
        callback(test);
      }
    };
  } else if (runStr === 'suite suite end') {
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
  } else if (runStr === 'pass end') {
    test = arg1;
    return function (event, callback) {
      if (event === ifStr1) {
        callback(test);
      }
      if (event === ifStr2) {
        callback();
      }
    };
  } else if (runStr === 'test end fail') {
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
  } else if (runStr === 'fail end pass') {
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
  }
}

function makeTest (err) {
  return {
    err: err,
    titlePath: function () {
      return ['test title'];
    }
  };
}

function createElements (argObj) {
  var res = [];
  for (var i = argObj.from; i <= argObj.to; i += 1) {
    res.push('element ' + i);
  }
  return res;
}

function makeExpectedTest (
  expectedTitle,
  expectedFullTitle,
  expectedDuration,
  currentRetry,
  expectedBody
) {
  return {
    title: expectedTitle,
    fullTitle: function () {
      return expectedFullTitle;
    },
    duration: expectedDuration,
    currentRetry: function () {
      return currentRetry;
    },
    slow: function () {}
  };
}

module.exports = { runnerEvent, makeTest, createElements, makeExpectedTest };
