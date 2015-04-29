var assert = require('assert');
var run    = require('./helpers').runMochaJSON;
var args   = [];

describe('multiple calls to done()', function() {
  var res;

  this.timeout(1000);

  before(function(done) {
    run('multiple.done.js', args, function(err, result) {
      res = result;
      done(err);
    });
  });

  it('results in failures', function() {
    assert.equal(res.stats.pending, 0);
    assert.equal(res.stats.passes, 1);
    assert.equal(res.stats.failures, 1);
    assert.equal(res.code, 1);
  });

  it('throws a descriptive error', function() {
    assert.equal(res.failures[0].err.message,
      'done() called multiple times');
  });
});
