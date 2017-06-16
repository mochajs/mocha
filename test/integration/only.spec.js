'use strict';

var run = require('./helpers').runMochaJSON;
var assert = require('assert');

describe('.only()', function () {
  describe('bdd', function () {
    it('should run only tests that marked as `only`', function (done) {
      run('options/only/bdd.fixture.js', ['--ui', 'bdd'], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 11);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('tdd', function () {
    it('should run only tests that marked as `only`', function (done) {
      run('options/only/tdd.fixture.js', ['--ui', 'tdd'], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 8);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('qunit', function () {
    it('should run only tests that marked as `only`', function (done) {
      run('options/only/qunit.fixture.js', ['--ui', 'qunit'], function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 5);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });
  });
});
