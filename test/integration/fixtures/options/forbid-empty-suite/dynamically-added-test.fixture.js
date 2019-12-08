'use strict';

describe('suite with dynamically added test', function() {
  const suite = this;
  before(function() {
    suite.suites[1].addTest(it('added test', function() {}));
  });

  describe('A', function() {
    it('existing test', () => {});
  });

  describe('B', function() {});
});
