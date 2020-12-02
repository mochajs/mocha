'use strict';

var assert = require('assert');

describe('suite', function () {
  it('test1', function () {
    assert(true);
  });

  it('test2', function () {
    assert.ok(false, '\u001b[31mnot ok\u001b[39m');
  });
});
