describe('repeats suite', function() {
  let calls = 0;
  this.repeats(3);

  it('should pass', function() {

  });

  it('should fail on the second call', function () {
    calls++;
    console.log(`RUN: ${calls}`);
    if (calls > 1) throw new Error();
  });
});
