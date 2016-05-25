var assert = require('assert');

describe('issue 2089', function() {
  it('should fail', function() {
    var d = new Date();
    // Force an error during reporter rendering
    d.toISOString = function() {
      throw new Error('error caused on purpose');
    };
    assert.deepEqual([d], ['a']);
  });
});
