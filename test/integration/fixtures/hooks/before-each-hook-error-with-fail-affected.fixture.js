'use strict';

describe('fails `beforeEach` hook', function () {
  beforeEach(function () {
    throw new Error('error in `beforeEach` hook');
  });
  it('test 1', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
  it('test 2', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
});
describe('passes normally', function () {
  it('test 3', function () {
    // This should pass normally
  });
});
