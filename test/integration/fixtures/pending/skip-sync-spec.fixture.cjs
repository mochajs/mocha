'use strict';
var assert = require('assert');

describe('skip in test', function () {
  var runOrder = [];
  beforeEach(function () {
    runOrder.push('beforeEach');
  });

  it('should skip immediately', function () {
    this.skip();
    throw new Error('never run this test');
  });
  it('should run other tests in suite', function () {});

  afterEach(function() {
    runOrder.push('afterEach');
  });
  after(function() {
    runOrder.push('after');
    assert.deepStrictEqual(runOrder, [
      'beforeEach', 'afterEach',
      'beforeEach', 'afterEach',
      'after'
    ]);
    throw new Error('should throw this error');
  });
});
