'use strict';

// Remaining tests after an uncaught exception must actually run.
// Previously Mocha aborted the runner and reported a passing count
// that included tests which never executed (#5251).
describe('a', function () {
  it('should pass', function () {});
});

describe('b', function () {
  it('should pass, then fail', function () {
    process.nextTick(function () {
      throw new Error('uncaught!!');
    });
  });
});

describe('c', function () {
  it('should still run and pass', function () {});
});

describe('d', function () {
  it('should still run and fail', function () {
    throw new Error('Oh no!');
  });
});
