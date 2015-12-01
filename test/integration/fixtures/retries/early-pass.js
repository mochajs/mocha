describe('retries', function() {
  this.retries(1);
  var times = 0;

  it('should quit early', function() {
    times++;
    if (times !== 2) {
      throw new Error('retry error ' + times);
    }
  });
});
