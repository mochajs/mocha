'use strict';

describe('outer describe', function () {
  it('should not run this test', function () {});
  describe('this suite should not run', function () {
    it('should not run this test', function () {});
  });
  describe.only('this .only suite should run', function () {
    describe('this suite should run', function () {
      it('should run this test in a nested suite', function () {});
    });
    it('should run this test', function () {});
  });
  describe('this suite should not run', function () {
    it('should not run this test', function () {});
  });
});
