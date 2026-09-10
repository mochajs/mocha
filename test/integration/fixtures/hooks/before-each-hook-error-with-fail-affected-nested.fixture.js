'use strict';

describe('outer', function () {
  beforeEach(function () {
    throw new Error('error in `beforeEach` hook');
  });
  it('direct test', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
  describe('nested', function () {
    it('nested test 1', function () {
      // This should be reported as failed due to beforeEach hook failure
    });
    it('nested test 2', function () {
      // This should be reported as failed due to beforeEach hook failure
    });
  });
});
