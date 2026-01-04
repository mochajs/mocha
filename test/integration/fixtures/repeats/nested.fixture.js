'use strict';

describe('repeats', function () {
  this.repeats(3);
  describe('nested', function () {
    let count = 0;

    it('should be executed only once', function () {
      this.repeats(1);
      count++;
      if (count > 1)
        throw new Error('repeat error');
    });
  });
});
