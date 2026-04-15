'use strict';

describe('suite', function () {
  afterEach(function () {
    throw new Error('after each hook error');
  });
  it('test 1', function () {
    // passes
  });
  it('test 2', function () {
    // should also run despite afterEach failure on test 1
  });
});
