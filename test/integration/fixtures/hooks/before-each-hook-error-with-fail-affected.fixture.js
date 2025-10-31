'use strict';

describe('spec 1', function () {
  beforeEach(function () {
    throw new Error('before each hook error');
  });
  it('test 1', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
  it('test 2', function () {
    // This should be reported as failed due to beforeEach hook failure
  });
});
describe('spec 2', function () {
  it('test 3', function () {
    // This should pass normally
  });
});
