'use strict';

describe('outer suite', function () {

  before(function () {
    console.log('outer before');
  });

  it('should run this test', function () { });

  describe('inner suite', function () {

    before(function (done) {
      console.log('inner before');
      var self = this;
      setTimeout(function () {
        self.skip();
        done();
      }, 0);
    });

    beforeEach(function () {
      throw new Error('beforeEach should not run');
    });

    afterEach(function () {
      throw new Error('afterEach should not run');
    });

    it('should not run this test', function () {
      throw new Error('inner suite test should not run');
    });

    after(function () {
      console.log('inner after');
    });

    describe('skipped suite', function () {
      before(function () {
        console.log('skipped before');
      });

      it('should not run this test', function () {
        throw new Error('skipped suite test should not run');
      });

      after(function () {
        console.log('skipped after');
      });
    });

  });

  it('should run this test', function () { });

  after(function () {
    console.log('outer after');
  });

});
