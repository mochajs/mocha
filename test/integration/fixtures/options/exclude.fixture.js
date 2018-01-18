'use strict';

describe('exclude', function() {
  describe('run', function() {
    it('should run', function () {});
    it('should also run', function () {});
  });
  describe('exclude-me', function() {
    it('should not be ran', function () {
      throw new Error('Spec should not run');
    });
  })
})
