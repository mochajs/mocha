'use strict';

describe('alpha', function () {
  it('should be executed first', function () {
    if (global.beta !== undefined) {
      throw new Error('alpha was not executed first');
    }

    if (global.theta !== undefined) {
      throw new Error('alpha was not executed first');
    }
  });
});
