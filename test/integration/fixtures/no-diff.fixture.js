'use strict';
var assert = require('assert');

describe('Example test', function () {
  it('should fail', function () {
    assert.deepEqual([1, 2, 3], ['foo', 'bar', 'baz']);
  });
});
