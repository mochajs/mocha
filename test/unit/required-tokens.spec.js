'use strict';

const assert = require('node:assert');
const {describe, it} = require('../..');

describe('using imported "describe"', function () {
  it('using imported "it"', function (done) {
    assert.ok(true);
    done();
  });
});
