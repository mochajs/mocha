'use strict';

var assert = require('assert');
var describe = require('../..').describe;
var it = require('../..').it;

describe('using imported describe', function() {
  it('using imported it', function(done) {
    assert.ok(true);
    done();
  });
});
