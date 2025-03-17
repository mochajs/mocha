'use strict';

var assert = require('node:assert');
var helpers = require('./helpers');
var run = helpers.runMochaJSON;
var invokeNode = helpers.invokeNode;
var toJSONResult = helpers.toJSONResult;
var args = [];

describe('pending', function () {
  describe('pending specs', function () {
    it('should be created by omitting a function', function (done) {
      run('pending/spec.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.strictEqual(res.stats.pending, 1);
        assert.strictEqual(res.stats.passes, 0);
        assert.strictEqual(res.stats.failures, 0);
        assert.strictEqual(res.code, 0);
        done();
      });
    });
    it('should return the test object when used via shorthand methods', function (done) {
      run('pending/skip-shorthand.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.strictEqual(res.stats.pending, 3);
        assert.strictEqual(res.stats.passes, 0);
        assert.strictEqual(res.stats.failures, 0);
        assert.strictEqual(res.code, 0);
        done();
      });
    });
    it('should keep hierarchies of suites', function (done) {
      run('pending/skip-hierarchy.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.strictEqual(res.stats.suites, 2);
        assert.strictEqual(res.stats.pending, 0);
        assert.strictEqual(res.stats.passes, 1);
        assert.strictEqual(res.stats.failures, 0);
        assert.strictEqual(res.code, 0);
        assert.strictEqual(
          res.passes[0].fullTitle,
          'a suite another suite a test'
        );
        done();
      });
    });
  });

  describe('synchronous skip()', function () {
    describe('in spec', function () {
      it('should immediately skip the spec and run all others', function (done) {
        run('pending/skip-sync-spec.fixture.js', args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 1)
            .and('to have pending test order', 'should skip immediately')
            .and('to have passed test count', 1)
            .and('to have passed tests', 'should run other tests in suite');
          done();
        });
      });
    });

    describe('in after', function () {
      it('should throw, but run all tests', function (done) {
        run('pending/skip-sync-after.fixture.js', args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', '`this.skip` forbidden')
            .and('to have failed test count', 1)
            .and('to have pending test count', 0)
            .and('to have passed test count', 3)
            .and(
              'to have passed test order',
              'should run this test-1',
              'should run this test-2',
              'should run this test-3'
            );
          done();
        });
      });
    });

    describe('in before', function () {
      it('should skip all suite specs', function (done) {
        run('pending/skip-sync-before.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.strictEqual(res.stats.pending, 2);
          assert.strictEqual(res.stats.passes, 2);
          assert.strictEqual(res.stats.failures, 0);
          assert.strictEqual(res.code, 0);
          done();
        });
      });
      it('should run before and after hooks', function (done) {
        run('pending/skip-sync-before-hooks.fixture.js', function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 2)
            .and('to have passed test count', 2)
            .and(
              'to have passed test order',
              'should run test-1',
              'should run test-2'
            );
          done();
        });
      });
      it('should skip all sync/async inner before/after hooks', function (done) {
        run('pending/skip-sync-before-inner.fixture.js', function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 2)
            .and('to have passed test count', 0)
            .and(
              'to have pending test order',
              'should never run this outer test',
              'should never run this inner test'
            );
          done();
        });
      });
    });

    describe('in before with nested describe', function () {
      it('should skip all suite specs, even if nested', function (done) {
        run(
          'pending/skip-sync-before-nested.fixture.js',
          args,
          function (err, res) {
            if (err) {
              done(err);
              return;
            }
            assert.strictEqual(res.stats.pending, 3);
            assert.strictEqual(res.stats.passes, 0);
            assert.strictEqual(res.stats.failures, 0);
            assert.strictEqual(res.code, 0);
            done();
          }
        );
      });
    });

    describe('in beforeEach', function () {
      it('should skip all suite specs', function (done) {
        var fixture = 'pending/skip-sync-beforeEach.fixture.js';
        run(fixture, args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 3)
            .and(
              'to have pending test order',
              'should skip this test-1',
              'should skip this test-2',
              'should skip this test-3'
            )
            .and('to have passed test count', 0);
          done();
        });
      });
      it('should skip only two suite specs', function (done) {
        var fixture = 'pending/skip-sync-beforeEach-cond.fixture.js';
        run(fixture, args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 2)
            .and(
              'to have pending test order',
              'should skip this test-1',
              'should skip this test-3'
            )
            .and('to have passed test count', 1)
            .and('to have passed test', 'should run this test-2');
          done();
        });
      });
    });
  });

  describe('asynchronous skip()', function () {
    describe('in spec', function () {
      it('should immediately skip the spec and run all others', function (done) {
        run('pending/skip-async-spec.fixture.js', args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 1)
            .and('to have pending test order', 'should skip async')
            .and('to have passed test count', 1)
            .and('to have passed tests', 'should run other tests in suite');
          done();
        });
      });
    });

    describe('in before', function () {
      it('should skip all suite specs', function (done) {
        run('pending/skip-async-before.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.strictEqual(res.stats.pending, 2);
          assert.strictEqual(res.stats.passes, 2);
          assert.strictEqual(res.stats.failures, 0);
          assert.strictEqual(res.code, 0);
          done();
        });
      });
      it('should run before and after hooks', function (done) {
        run('pending/skip-async-before-hooks.fixture.js', function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 2)
            .and('to have passed test count', 2)
            .and(
              'to have passed test order',
              'should run test-1',
              'should run test-2'
            );
          done();
        });
      });
    });

    describe('in before with nested describe', function () {
      it('should skip all suite specs, even if nested', function (done) {
        run(
          'pending/skip-async-before-nested.fixture.js',
          args,
          function (err, res) {
            if (err) {
              done(err);
              return;
            }
            assert.strictEqual(res.stats.pending, 3);
            assert.strictEqual(res.stats.passes, 0);
            assert.strictEqual(res.stats.failures, 0);
            assert.strictEqual(res.code, 0);
            done();
          }
        );
      });
    });

    describe('in beforeEach', function () {
      it('should skip all suite specs', function (done) {
        var fixture = 'pending/skip-async-beforeEach.fixture.js';
        run(fixture, args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with error', 'should throw this error')
            .and('to have failed test count', 1)
            .and('to have pending test count', 3)
            .and(
              'to have pending test order',
              'should skip this test-1',
              'should skip this test-2',
              'should skip this test-3'
            )
            .and('to have passed test count', 0);
          done();
        });
      });
    });
  });

  describe('programmatic usage', function () {
    it('should skip the test by listening to test event', function (done) {
      var path = require.resolve('./fixtures/pending/programmatic.fixture.js');
      invokeNode([path], function (err, res) {
        if (err) {
          return done(err);
        }
        var result = toJSONResult(res);
        expect(result, 'to have passed')
          .and('to have passed test count', 0)
          .and('to have pending test count', 1)
          .and('to have pending test order', 'should succeed');
        done();
      });
    });
  });
});
