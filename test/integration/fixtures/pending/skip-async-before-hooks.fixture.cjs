'use strict';
var assert = require('assert');

describe('outer suite', function() {
  var runOrder = [];
  before(function() {
    runOrder.push('outer before');
  });

  it('should run test-1', function() {
    runOrder.push('should run test-1');
  });

  describe('inner suite', function() {
    before(function(done) {
      runOrder.push('inner before');
      var self = this;
      setTimeout(function() {
        self.skip();   // done() is not required
      }, 0);
    });

    before(function() {
      runOrder.push('inner before-2 should not run');
    });

    beforeEach(function() {
      runOrder.push('beforeEach should not run');
    });

    afterEach(function() {
      runOrder.push('afterEach should not run');
    });

    after(function() {
      runOrder.push('inner after');
    });

    it('should not run this test', function() {
      throw new Error('inner suite test should not run');
    });

    describe('skipped suite', function() {
      before(function() {
        runOrder.push('skipped suite before should not run');
      });

      it('should not run this test', function() {
        throw new Error('skipped suite test should not run');
      });

      after(function() {
        runOrder.push('skipped suite after should not run');
      });
    });
  });

  it('should run test-2', function() {
    runOrder.push('should run test-2');
  });

  after(function() {
    runOrder.push('outer after');
    assert.deepStrictEqual(runOrder, [
      'outer before', 
      'should run test-1', 'should run test-2',
      'inner before', 'inner after',
      'outer after'
    ]);
    throw new Error('should throw this error');
  });
});
