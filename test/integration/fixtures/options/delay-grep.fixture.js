'use strict';

var assert = require('assert');

enableDelay("delay-grep");

describe('suite1', function () {

  it('should match grep1', function () {
    assert(true);
  });

  it('should not match', function () {
    assert(true);
  });
});

describe('suite2', function () {

  it('should match grep1', function () {
    assert(true);
  });

  it('should not match', function () {
    assert(true);
  });
});

describe('suite3', function () {

  it('should match grep1', function () {
    assert(true);
  });

  it('should not match', function () {
    assert(true);
  });
});

setTimeout(function () {
  run("delay-grep");
}, 100);