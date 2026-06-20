'use strict';
var assert = require('assert');

describe('outer suite', function() {
  var runOrder = [];
  before(function() {
    runOrder.push('outer before');
    this.skip();
  });

  it('should never run this outer test', function() {
    throw new Error('outer suite test should not run');
  });

  describe('inner suite', function() {
    before(function() { runOrder.push('no inner before'); });
    before(function(done) { runOrder.push('no inner before'); done(); });
    before(async function() { runOrder.push('no inner before'); });
    before(function() { return Promise.resolve(runOrder.push('no inner before')) });

    after(function() { runOrder.push('no inner after'); });
    after(function(done) { runOrder.push('no inner after'); done(); });
    after(async function() { runOrder.push('no inner after'); });
    after(function() { return Promise.resolve(runOrder.push('no inner after')) });

    it('should never run this inner test', function() {
      throw new Error('inner suite test should not run');
    });
  });

  after(function() {
    runOrder.push('outer after');
    assert.deepStrictEqual(runOrder, [
      'outer before', 'outer after'
    ]);
    throw new Error('should throw this error');
  });
});
