'use strict';

describe('skip in before with nested describes', function () {
  before(function () {
    this.skip();
  });

  it('should never run this test', function () { });

  describe('nested describe', function () {
    before(function () {
      throw new Error('first level before should not run');
    });

    it('should never run this test', function () { });

    after(function () {
      throw new Error('first level after should not run');
    });

    describe('nested again', function () {
      before(function () {
        throw new Error('second level before should not run');
      });

      it('should never run this test', function () { });

      after(function () {
        throw new Error('second level after should not run');
      });
    });
  });
});
