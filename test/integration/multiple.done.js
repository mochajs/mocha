var assert = require('assert');
var run    = require('./helpers').runMochaJSON;
var args   = [];

describe('multiple calls to done()', function() {
  var res;
  describe('from a spec', function() {
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

  describe('with multiple specs', function() {
    before(function(done) {
      run('multiple.done.specs.js', args, function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in a failure', function() {
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 2);
      assert.equal(res.stats.failures, 1);
      assert.equal(res.code, 1);
    });

    it('correctly attributes the error', function() {
      assert.equal(res.failures[0].fullTitle, 'suite test1');
      assert.equal(res.failures[0].err.message,
        'done() called multiple times');
    });
  });

  describe('from a before hook', function() {
    before(function(done) {
      run('multiple.done.before.js', args, function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in a failure', function() {
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 1);
      assert.equal(res.stats.failures, 1);
      assert.equal(res.code, 1);
    });

    it('correctly attributes the error', function() {
      assert.equal(res.failures[0].fullTitle, 'suite "before all" hook');
      assert.equal(res.failures[0].err.message,
        'done() called multiple times');
    });
  });

  describe('from a beforeEach hook', function() {
    before(function(done) {
      run('multiple.done.beforeEach.js', args, function(err, result) {
        res = result;
        done(err);
      });
    });

    it('results in a failure', function() {
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 2);
      assert.equal(res.stats.failures, 2);
      assert.equal(res.code, 2);
    });

    it('correctly attributes the errors', function() {
      assert.equal(res.failures.length, 2);
      res.failures.forEach(function(failure) {
        assert.equal(failure.fullTitle, 'suite "before each" hook');
        assert.equal(failure.err.message,
          'done() called multiple times');
      });
    });
  });
});
