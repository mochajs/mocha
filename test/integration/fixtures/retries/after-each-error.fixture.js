'use strict';

describe('afterEach error with retries', function () {
  afterEach(function () {
    throw new Error('Error from after each');
  });

  it('test one', function () {
    throw new Error('Error from test');
  });
});
