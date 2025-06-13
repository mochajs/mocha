'use strict';

// One passing test and three failing tests

var assert = require('assert');

describe('suite', function () {
  it('test1', function () {
    assert(true);
  });

  it('test2', function () {
    assert(false);
  });

  it('test3', function () {
    assert(false);
  });

  it('test4', function () {
    assert(false);
  });
});
