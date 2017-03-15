'use strict';

describe('one', function () {
  before(function () {
    console.log('before one');
  });

  after(function () {
    console.log('after one');
  });

  beforeEach(function () {
    console.log('  before each one');
  });

  afterEach(function () {
    console.log('  after each one');
  });

  describe('two', function () {
    before(function () {
      console.log('  before two');
    });

    after(function () {
      console.log('  after two');
    });

    beforeEach(function () {
      console.log('    before each two');
    });

    afterEach(function () {
      console.log('    after each two');
    });

    describe('three', function () {
      before(function () {
        console.log('    before three');
      });

      after(function () {
        console.log('    after three');
      });

      beforeEach(function () {
        console.log('    before each three');
      });

      afterEach(function () {
        console.log('    after each three');
      });

      it('should three', function () {
        console.log('      TEST three');
      });
    });
  });
});
