var assert = require('assert');
var run    = require('./helpers').runMochaJSON;

describe('regressions', function() {
  this.timeout(1000);

  it('issue-1327: should run all 3 specs exactly once', function(done) {
    var args = [];
    run('regression/issue-1327.js', args, function(err, res) {
      assert(!err);
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 2);
      assert.equal(res.stats.failures, 1);

      assert.equal(res.passes[0].title, 'test 1');
      assert.equal(res.passes[1].title, 'test 2');
      assert.equal(res.failures[0].title, 'test 3');
      assert.equal(res.code, 1);
      done();
    });
  });
});
