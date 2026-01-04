'use strict';
describe('repeats', function () {
  this.repeats(2);
  var times = 0;

  it('should fail on the second attempt', function () {
    if (times++ > 0) throw new Error;
  });
});
