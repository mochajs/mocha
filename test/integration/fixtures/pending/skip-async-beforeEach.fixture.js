'use strict';
var assert = require('assert');

describe('skip in beforeEach', function() {
  var runOrder = [];
  beforeEach(function(done) {
    runOrder.push('beforeEach');
    var self = this;
    setTimeout(function() {
      self.skip();   // done() is not required
    }, 10);
  });

  it('should skip this test-1', function() {
    throw new Error('never run this test');
  });

  describe('inner', function() {
    beforeEach(function() {
      runOrder.push('should not run');
    });

    it('should skip this test-2', function() {
      throw new Error('never run this test');
    });
    it('should skip this test-3', function() {
      throw new Error('never run this test');
    });

    afterEach(function() {
      runOrder.push('should not run');
    });
  });

  afterEach(function() {
    runOrder.push('afterEach');
  });
  after(function() {
    runOrder.push('after');
    assert.deepStrictEqual(runOrder, [
      'beforeEach', 'afterEach',
      'beforeEach', 'afterEach',
      'beforeEach', 'afterEach',
      'after'
    ]);
    throw new Error('should throw this error');
  });
});
