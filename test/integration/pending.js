var assert = require('assert');
var run    = require('./helpers').runMochaJSON;
var args   = [];

describe('pending', function() {
  describe('pending specs', function() {
    it('should be created by omitting a function', function(done) {
      run('pending/spec.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 1);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('synchronous skip()', function() {
    describe('in spec', function() {
      it('should immediately skip the spec and run all others', function(done) {
        run('pending/skip.sync.spec.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 1);
          assert.equal(res.stats.passes, 1);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });

    describe('in before', function() {
      it('should skip all suite specs', function(done) {
        run('pending/skip.sync.before.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 2);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });

    describe('in beforeEach', function() {
      it('should skip all suite specs', function(done) {
        run('pending/skip.sync.beforeEach.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 2);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });
  });

  describe('asynchronous skip()', function() {
    describe('in spec', function() {
      it('should immediately skip the spec and run all others', function(done) {
        run('pending/skip.async.spec.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 1);
          assert.equal(res.stats.passes, 1);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });

    describe('in before', function() {
      it('should skip all suite specs', function(done) {
        run('pending/skip.async.before.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 2);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });

    describe('in beforeEach', function() {
      it('should skip all suite specs', function(done) {
        run('pending/skip.sync.beforeEach.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 2);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });
  });
});
