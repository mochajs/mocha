'use strict';

describe('outer suite', function () {

  before(function () {
    console.log('outer before');
  });

  it('should run this test', function () { });

  describe('inner suite', function () {
    before(function () {
      this.skip();
    });

    before(function () {
      console.log('inner before');
    });

    beforeEach(function () {
      throw new Error('beforeEach should not run');
    });

    afterEach(function () {
      throw new Error('afterEach should not run');
    });

    after(function () {
      console.log('inner after');
    });

    it('should never run this test', function () {
      throw new Error('inner suite test should not run');
    });

    describe('skipped suite', function () {
      before(function () {
        console.log('skipped before');
      });

      it('should never run this test', function () {
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
  })

});
