describe('parallel suite', function () {
  var start;

  this.parallel(true);

  before(function (done) {
    start = new Date();
    done();
  });

  after(function (done) {
    var end = new Date();
    (end.getTime() - start.getTime()).should.be.below(200);
    done();
  })

  describe('parallel suite 1', function () {
    it('test 1-1', function (done) {
      setTimeout(done, 0);
    });

    it('async test 1-2', function (done) {
      setTimeout(done, 100);
    });

    it('pending test');

    after(function (done) {
      var end = new Date();
      (end.getTime() - start.getTime()).should.be.below(110);
      done();
    })
  })

  describe('parallel suite 2', function () {
    it('test 2-1', function (done) {
      setTimeout(done, 60);
    })

    it('test 2-2', function (done) {
      setTimeout(done, 60);
    })

    after(function (done) {
      var end = new Date();
      (end.getTime() - start.getTime()).should.be.below(130);
      done();
    })
  });
})
