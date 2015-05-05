var assert = require('assert');
var run    = require('./helpers').runMochaJSON;
var args   = [];

describe('this.timeout()', function() {
  this.timeout(1000);

  it('is respected by sync and async suites', function(done) {
    run('timeout.js', args, function(err, res) {
      assert(!err);
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 0);
      assert.equal(res.stats.failures, 2);
      assert.equal(res.code, 2);
      done();
    });
  });
});
