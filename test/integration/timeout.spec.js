'use strict';

var assert = require('assert');
var run = require('./helpers').runMochaJSON;
var args = [];

describe('this.timeout()', function() {
  it('is respected by sync and async suites', function(done) {
    run('timeout.fixture.js', args, function(err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.pending, 0);
      assert.strictEqual(res.stats.passes, 0);
      assert.strictEqual(res.stats.failures, 2);
      assert.strictEqual(res.code, 2);
      done();
    });
  });
});
