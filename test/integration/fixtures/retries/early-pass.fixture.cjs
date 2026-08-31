'use strict';
const assert = require('assert');

describe('retries', function () {
  this.retries(1);
  var times = 0;
  var self = this;

  it('should pass after 1 retry', function () {
    times++;
    if (times !== 2) {
      throw new Error('retry error ' + times);
    }
  });
  
  it('check for updated `suite.tests`', function() {
    assert.strictEqual(self.tests[0]._currentRetry, 1);
    assert.ok(self.tests[0]._retriedTest);
    assert.strictEqual(self.tests[0].state, 'passed');
  })
});
