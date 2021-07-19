'use strict';

describe('All test skipped', function() {
  beforeEach(function() {
    expect.fail('Should not call hooks');
  });

  afterEach(function() {
    expect.fail('Should not call hooks');
  });

  describe('hooks', function() {
    beforeEach(function() {
      expect.fail('Should not call hooks');
    });

    it.skip('one');

    afterEach(function() {
      expect.fail('Should not call hooks');
    });

    after(function() {
      expect.fail('Should not call hooks');
    });
  });
});
