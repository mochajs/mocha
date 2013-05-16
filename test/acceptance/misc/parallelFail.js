describe('parallel failing', function () {

  this.parallel(true);
  var runs = 0;

  after(function (done) {
    runs.should.eql(4);
    done();
  })

  describe('bailing suite 1', function () {

    this.bail(true);

    it('test 1-1', function (done) {
      runs++;
      setTimeout(done, 80);
    })

    it('should fail', function (done) {
      throw new Error('this is ok (1-2)');
    });

    it('should not run this', function (done) {
      throw new Error('we should have bailed');
    });
  })

  describe('suite 2', function () {
    it('test 2-1', function (done) {
      runs++;
      setTimeout(done, 80);
    })

    it('should fail', function (done) {
      throw new Error('this is ok (2-2)');
    });

    it('should run this if not bailing', function () {
      runs++;
    })
  })

  describe('suite 3', function () {
    it('test 3-1', function (done) {
      setTimeout(done, 80);
      runs++;
    })

    it('pending test');

    it('should fail', function (done) {
      throw new Error('this is ok (3-2)');
    });
  })
})
