'use strict';

var assert = require('assert');
var run = require('./helpers').runMochaJSON;
var args = [];

describe('this.timeout()', function () {
  it('is respected by sync and async suites', function (done) {
    run('timeout.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.equal(res.stats.pending, 0);
      assert.equal(res.stats.passes, 0);
      assert.equal(res.stats.failures, 2);
      assert.equal(res.code, 2);
      done();
    });
  });

  describe('0 (no timeout)', function () {
    var itIfNodeWorthy = (function () {
      var version = process.versions.node.split('.').map(Number);
      return version[0] === 0 && version[1] === 10;
    })() ? it.skip.bind(it) : it;

    itIfNodeWorthy('does not spuriously end async tests that miss calling `done`', function (done) {
      run('timeout-0-done.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);
        assert.equal(res.code, 1);
        done();
      });
    });

    itIfNodeWorthy('does not spuriously end promise tests that never resolve', function (done) {
      run('timeout-0-promise.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);
        assert.equal(res.code, 1);
        done();
      });
    });

    describe('with --allow-uncaught', function () {
      before(function () {
        args = args.concat('--allow-uncaught');
      });

      itIfNodeWorthy('does not spuriously end async tests that miss calling `done`', function (done) {
        run('timeout-0-done.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 1);
          assert.equal(res.code, 1);
          done();
        });
      });

      itIfNodeWorthy('does not spuriously end promise tests that never resolve', function (done) {
        run('timeout-0-promise.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 0);
          assert.equal(res.stats.failures, 1);
          assert.equal(res.code, 1);
          done();
        });
      });
    });
  });
});
