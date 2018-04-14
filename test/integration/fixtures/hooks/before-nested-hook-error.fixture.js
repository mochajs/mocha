'use strict';

describe('spec 1', function () {
  it('should pass', function () {
    console.log('test 1');
  });
  describe('nested', function () {
    before(function() {
      throw new Error('Nested before hook error');
    });
    it('should fail because of hook error', function () {
      console.log('test 2');
    });
  });
});
