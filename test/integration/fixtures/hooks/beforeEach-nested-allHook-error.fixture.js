'use strict';
var assert = require('assert');

describe('outer suite', function() {
  var runOrder = [];
  describe('spec 1', function() {
    beforeEach(function() {
      runOrder.push('spec 1 beforeEach');
      throw new Error('spec 1 beforeEach hook error');
    });
    afterEach(function() {
      runOrder.push('spec 1 afterEach');
    });

    it('should not run test-1', function() {
      throw new Error('test-1 should not run');
    });

    describe('nested spec 1', function() {
      before(function() { runOrder.push('do not run'); });
      beforeEach(function() { runOrder.push('do not run'); });
      afterEach(function() { runOrder.push('do not run'); });
      after(function() { runOrder.push('do not run'); });

      it('should not run nested test-2', function() {
        throw new Error('nested test-2 should not run');
      });
    });
  });

  describe('spec 2', function() {
    beforeEach(function() {
      runOrder.push('spec 2 beforeEach');
      throw new Error('spec 2 beforeEach hook error');
    });
    afterEach(function() {
      runOrder.push('spec 2 afterEach');
    });

    describe('nested spec 2', function() {
      before(function() {
        runOrder.push('nested spec 2 before');
      });
      beforeEach(function() { runOrder.push('do not run'); });
      afterEach(function() { runOrder.push('do not run'); });
      after(function() {
        runOrder.push('nested spec 2 after');
      });

      it('should not run nested test-3', function() {
        throw new Error('nested test-3 should not run');
      });
    });
  });

  after(function() {
    runOrder.push('outer after');
    assert.deepStrictEqual(runOrder, [
      'spec 1 beforeEach', 'spec 1 afterEach',
      'nested spec 2 before',
      'spec 2 beforeEach', 'spec 2 afterEach',
      'nested spec 2 after',
      'outer after'
    ]);
    throw new Error('should throw this error');
  });
});
