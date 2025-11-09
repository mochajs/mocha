'use strict';

describe('fails `before` hook', function () {
  before(function () {
    throw new Error('error in `before` hook');
  });
  it('test 1', function () {
    // This should be reported as failed due to before hook failure
  });
  it('test 2', function () {
    // This should be reported as failed due to before hook failure
  });
});
describe('passes normally', function () {
  it('test 3', function () {
    // This should pass normally
  });
});
