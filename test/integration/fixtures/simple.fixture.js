'use strict';

var assert = require('assert');

it('success test1', function () {
    assert(true);
});

describe('suite1', function () {
  it('success test 1-1', function () {
    assert(true);
  });

  it('success test 1-2', function () {
    assert(true);
  });
});

describe('suite2', function () {
    it('success test 2-1', function () {
      assert(true);
    });
  
    it('fail test 2-2', function () {
      assert(false);
    });
});
  
describe('suite3', function () {
    describe('suite3-1', function () {
        it('success test 3-1-1', function () {
            assert(true);
          });
        it('fail test 3-1-2', function () {
            assert(false);
        });
    });
});
  

