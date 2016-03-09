var run = require('./helpers').runMochaJSON;
var assert = require('assert');

describe('.only()', function() {
  this.timeout(2000);

  it('should run only tests that marked as `only`', function(done) {
    run('options/only/bdd.js', ['--ui', 'bdd'], function(err, res) {
      assert(!err);
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 3);
      assert.equal(res.stats.failures, 0);
      assert.equal(res.code, 0);
      done();
    });
  });

  it('should run only tests that marked as `only`', function(done) {
    run('options/only/tdd.js', ['--ui', 'tdd'], function(err, res) {
      assert(!err);
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 4);
      assert.equal(res.stats.failures, 0);
      assert.equal(res.code, 0);
      done();
    });
  });

  it('should run only tests that marked as `only`', function(done) {
    run('options/only/qunit.js', ['--ui', 'qunit'], function(err, res) {
      assert(!err);
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 5);
      assert.equal(res.stats.failures, 0);
      assert.equal(res.code, 0);
      done();
    });
  });
});