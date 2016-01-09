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

  it('should allow override and run appropriate hooks', function(){
    this.retries(4);
    console.log('TEST', times);
    times++;
    throw new Error('retry error');
  });
});
