var assert = require('assert');
var run    = require('./helpers').runMochaJSON;
var args   = [];

describe('options', function() {
  this.timeout(2000);

  describe('--async-only', function() {

    before(function() {
      args = ['--async-only'];
    });

    it('should fail synchronous specs', function(done) {
      run('options/async-only.sync.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.failures[0].title, 'throws an error');
        assert.equal(res.code, 1);
        done();
      });
    });

    it('should allow asynchronous specs', function(done) {
      run('options/async-only.async.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 1);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].title, 'should pass');
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('--bail', function() {
    before(function() {
      args = ['--bail'];
    });

    it('should stop after the first error', function(done) {
      run('options/bail.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 1);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.passes[0].title, 'should display this spec');
        assert.equal(res.failures[0].title, 'should only display this error');
        assert.equal(res.code, 1);
        done();
      });
    });
  });

  describe('--sort', function() {
    before(function() {
      args = ['--sort'];
    });

    it('should sort tests in alphabetical order', function(done) {
      run('options/sort*', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].fullTitle,
          'alpha should be executed first');
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('--delay', function() {
    before(function() {
      args = ['--delay'];
    });

    it('should run the generated test suite', function(done) {
      run('options/delay.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].title,
          'should have waited 500ms to run this suite');
        assert.equal(res.code, 0);
        done();
      });
    });

    it('should throw an error if the test suite failed to run', function(done) {
      run('options/delay-fail.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.failures[0].title,
          'Uncaught error outside test suite');
        assert.equal(res.code, 1);
        done();
      });
    });
  });

  describe('--grep', function() {
    it('runs specs matching a string', function(done) {
      args = ['--grep', 'match'];
      run('options/grep.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });

    it('runs specs matching a RegExp', function(done) {
      args = ['--grep', '.*'];
      run('options/grep.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 1);
        assert.equal(res.code, 1);
        done();
      });
    });

    describe('with --invert', function() {
      it('runs specs that do not match the pattern', function(done) {
        args = ['--grep', 'fail', '--invert'];
        run('options/grep.js', args, function(err, res) {
          assert(!err);
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 2);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });
  });

  describe('--retries', function() {
    it('retries after a certain threshold', function (done) {
      args = ['--retries', '3'];
      run('options/retries.js', args, function(err, res) {
        assert(!err);
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.tests, 1);
        assert.equal(res.tests[0].currentRetry, 3);
        assert.equal(res.stats.failures, 1);
        assert.equal(res.code, 1);
        done();
      });
    })
  });
});
