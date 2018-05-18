'use strict';

describe('beta', function () {
  it('should be executed second', function () {
    global.beta = 1;

    if (global.theta !== undefined) {
      throw new Error('beta was not executed second');
    }
  });
});
