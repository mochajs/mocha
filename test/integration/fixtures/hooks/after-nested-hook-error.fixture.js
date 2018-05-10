'use strict';

describe('spec 1', function () {
  it('should not blame me', function () {
    console.log('test 1');
  });
  describe('nested 1', function () {
    after(function() {
      throw new Error('Nested before hook error');
    });
    it('blames me', function () {
      console.log('test 2');
    });
  });
  describe('nested 2', function() {
    it('should not blame me either', function() {
      console.log('test 3');
    });
  });
});
