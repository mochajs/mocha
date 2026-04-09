'use strict';

setTimeout(function () {
  describe('suite3', function () {
    it('suite3 should never run', function () {
      throw new Error('suite3 should not run');
    });
  });
}, 100);