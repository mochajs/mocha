'use strict';
var assert = require('assert');

describe('suite1', function () {
  var runOrder = [];
  before('before suite1', function () {
    runOrder.push('before suite1');
    throw new Error('before suite1 error');
  });
  beforeEach('beforeEach suite1', function () {
    runOrder.push('beforeEach suite1 - should not run');
  });
  it('test suite1', function () {
    runOrder.push('test suite1 - should not run');
  });

  describe('suite1A', function () {
    before('before suite1A', function () {});
    beforeEach('beforeEach suite1A', function () {}); 
    it('test suite1A', function () {
      runOrder.push('test suite1A - should not run');
    });
    afterEach('afterEach suite1A', function () {});
    after('after suite1A', function () {});
  });

  afterEach('afterEach suite1', function () {
    runOrder.push('afterEach suite1 - should not run');
  });
  after('after suite1', function () {
    runOrder.push('after suite1');
    assert.deepStrictEqual(runOrder, ['before suite1', 'after suite1']);
  });
});

describe('suite2', function () {
  before('before suite2', function () {});
  beforeEach('beforeEach suite2', function () {});
  it('test suite2', function () {
    console.log('test suite2 - should not run');
  });
  afterEach('afterEach suite2', function () {});
  after('after suite2', function () {});
});
