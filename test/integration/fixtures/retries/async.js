describe('retries', function() {
  var times = 0;
  before(function () {
    console.log('before');
  });

  after(function () {
    console.log('after');
  });

  beforeEach(function() {
    console.log('before each', times);
  });

  afterEach(function () {
    console.log('after each', times);
  });

  it('should allow override and run appropriate hooks', function (done) {
    this.timeout(200);
    this.retries(2);
    console.log('TEST', times);
    if (++times < 3) {
      return setTimeout(done, 300);
    }
    setTimeout(done, 50);
  });
});
