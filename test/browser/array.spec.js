'use strict';

describe('Array', function () {
  describe('#push()', function () {
    it('should append a value', function () {
      var arr = [];
      arr.push('foo');
      arr.push('bar');
      arr.push('baz');
      assert(arr[0] === 'foo'); // to test indentation
      assert(arr[1] === 'bar');
      assert(arr[2] === 'baz');
    });

    it('should return the length', function () {
      var arr = [];
      assert(arr.push('foo') === 1);
      assert(arr.push('bar') === 2);
      assert(arr.push('baz') === 3);
    });
  });
});

describe('Array', function () {
  describe('#pop()', function () {
    it('should remove and return the last value with expected error', function () {
      var arr = [1, 2, 3];
      assert(arr.pop() === 3);
      assert(arr.pop() === 2);
      assert(arr.pop() === -1);
    });

    it('should adjust .length', function () {
      var arr = [1, 2, 3];
      arr.pop();
      assert(arr.length === 2);
    });
  });
});
