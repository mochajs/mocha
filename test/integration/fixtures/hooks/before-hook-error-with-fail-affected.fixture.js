'use strict';

describe('spec 1', function () {
  before(function () {
    throw new Error('before hook error');
  });
  it('test 1', function () {
    // This should be reported as failed due to before hook failure
  });
  it('test 2', function () {
    // This should be reported as failed due to before hook failure
  });
});
describe('spec 2', function () {
  it('test 3', function () {
    // This should pass normally
  });
});
