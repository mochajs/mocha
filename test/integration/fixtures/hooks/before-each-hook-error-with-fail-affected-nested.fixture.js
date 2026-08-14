'use strict';

describe('fails `beforeEach` hook', function () {
  beforeEach(function () {
    throw new Error('error in `beforeEach` hook');
  });
  it('direct test', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
  describe('nested suite', function () {
    it('nested test 1', function () {
      // This should be reported as failed due to the parent beforeEach hook failure
    });
    it('nested test 2', function () {
      // This should be reported as failed due to the parent beforeEach hook failure
    });
  });
});
describe('passes normally', function () {
  it('unaffected test', function () {
    // This should pass normally
  });
});
