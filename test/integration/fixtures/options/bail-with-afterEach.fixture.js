'use strict';
var assert = require('assert');

describe('suite1', function () {
  var runOrder = [];
  before('before suite1', function () {
    runOrder.push('before suite1');
  });
  beforeEach('beforeEach suite1', function () {
    runOrder.push('beforeEach suite1');
  });
  it('test suite1', function () {
    runOrder.push('test suite1');
  });

  describe('suite1A', function () {
    before('before suite1A', function () {
      runOrder.push('before suite1A');
    });
    beforeEach('beforeEach suite1A', function () {
      runOrder.push('beforeEach suite1A');
    }); 
    it('test suite1A', function () {
      runOrder.push('test suite1A');
    });
    afterEach('afterEach suite1A', function () {
      runOrder.push('afterEach suite1A');
      throw new Error('afterEach suite1A error');
    });
    after('after suite1A', function () {
      runOrder.push('after suite1A');
    });
  });

  afterEach('afterEach suite1', function () {
    runOrder.push('afterEach suite1');
  });
  after('after suite1', function () {
    runOrder.push('after suite1');
    assert.deepStrictEqual(runOrder, [
      'before suite1', 'beforeEach suite1', 'test suite1',
      'afterEach suite1', 'before suite1A', 'beforeEach suite1',
      'beforeEach suite1A', 'test suite1A', 'afterEach suite1A',
      'afterEach suite1', 'after suite1A', 'after suite1'
    ]);
  });
});

describe('suite2', function () {
  before('before suite2', function () {});
  beforeEach('beforeEach suite2', function () {});
  it('test suite2', function () {
    runOrder.push('test suite2 - should not run');
  });
  afterEach('afterEach suite2', function () {});
  after('after suite2', function () {});
});
