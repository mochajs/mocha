'use strict';

var assert = require('assert');
var run = require('./helpers').runMochaJSON;
var args = [];

describe('uncaught exceptions', function() {
  it('handles uncaught exceptions from hooks', function(done) {
    run('uncaught-hook.fixture.js', args, function(err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.pending, 0);
      assert.strictEqual(res.stats.passes, 0);
      assert.strictEqual(res.stats.failures, 1);

      assert.strictEqual(
        res.failures[0].fullTitle,
        'uncaught "before each" hook'
      );
      assert.strictEqual(res.code, 1);
      done();
    });
  });

  it('handles uncaught exceptions from async specs', function(done) {
    run('uncaught.fixture.js', args, function(err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.pending, 0);
      assert.strictEqual(res.stats.passes, 0);
      assert.strictEqual(res.stats.failures, 2);

      assert.strictEqual(
        res.failures[0].title,
        'fails exactly once when a global error is thrown first'
      );
      assert.strictEqual(
        res.failures[1].title,
        'fails exactly once when a global error is thrown second'
      );
      assert.strictEqual(res.code, 2);
      done();
    });
  });

  it('handles uncaught exceptions from which Mocha cannot recover', function(done) {
    run('uncaught-fatal.fixture.js', args, function(err, res) {
      if (err) {
        return done(err);
      }

      var testName = 'should bail if a successful test asynchronously fails';
      expect(res, 'to have failed')
        .and('to have passed test count', 1)
        .and('to have failed test count', 1)
        .and('to have passed test', testName)
        .and('to have failed test', testName);

      done();
    });
  });
});
