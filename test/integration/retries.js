var assert = require('assert');
var helpers = require('./helpers');
var args   = [];

describe('retries', function() {
  this.timeout(1000);

  it('are ran in correct order', function(done) {
    helpers.runMocha('retries/hooks.js', args, function(err, res) {
      var lines, expected;

      assert(!err);

      lines = res.output.split(/[\n․]+/).map(function(line) {
        return line.trim();
      }).filter(function(line) {
        return line.length;
      }).slice(0, -1);

      expected = [
        'before',
        'before each 0',
        'TEST 0',
        'after each 1',
        'before each 1',
        'TEST 1',
        'after each 2',
        'before each 2',
        'TEST 2',
        'after each 3',
        'before each 3',
        'TEST 3',
        'after each 4',
        'before each 4',
        'TEST 4',
        'after each 5',
        'after'
      ];

      expected.forEach(function(line, i) {
        assert.equal(lines[i], line);
      });

      assert.equal(res.code, 1);
      done();
    });
  });

  it('should exit early if test passes', function (done) {
    helpers.runMochaJSON('retries/early-pass.js', args, function(err, res) {
      assert(!err);
      assert.equal(res.stats.passes, 1);
      assert.equal(res.stats.failures, 0);
      assert.equal(res.tests[0].currentRetry, 1);
      assert.equal(res.stats.tests, 1);
      assert.equal(res.code, 0);
      done();
    });
  });

  it('should let test override', function (done) {
    helpers.runMochaJSON('retries/nested.js', args, function(err, res) {
      assert(!err);
      assert.equal(res.stats.passes, 0);
      assert.equal(res.stats.failures, 1);
      assert.equal(res.stats.tests, 1);
      assert.equal(res.tests[0].currentRetry, 1);
      assert.equal(res.code, 1);
      done();
    });
  });

  it('should not hang w/ async test', function (done) {
    helpers.runMocha('retries/async.js', args, function(err, res) {
      var lines, expected;

      assert(!err);

      lines = res.output.split(/[\n․]+/).map(function(line) {
        return line.trim();
      }).filter(function(line) {
        return line.length;
      }).slice(0, -1);

      expected = [
        'before',
        'before each 0',
        'TEST 0',
        'after each 1',
        'before each 1',
        'TEST 1',
        'after each 2',
        'before each 2',
        'TEST 2',
        'after each 3',
        'after'
      ];

      expected.forEach(function(line, i) {
        assert.equal(lines[i], line);
      });

      assert.equal(res.code, 0);
      done();
    });
  });
});
