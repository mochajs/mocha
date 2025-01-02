'use strict';

var assert = require('node:assert');
var helpers = require('./helpers');
var runJSON = helpers.runMochaJSON;
var args = [];
var bang = require('../../lib/reporters/base').symbols.bang;

describe('retries', function () {
  it('are ran in correct order', function (done) {
    helpers.runMocha(
      'retries/hooks.fixture.js',
      ['--reporter', 'dot'],
      function (err, res) {
        var lines, expected;

        if (err) {
          done(err);
          return;
        }

        lines = res.output
          .split(helpers.SPLIT_DOT_REPORTER_REGEXP)
          .map(function (line) {
            return line.trim();
          })
          .filter(function (line) {
            return line.length;
          })
          .slice(0, -1);

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
          bang + 'after each 5',
          'after'
        ];

        expected.forEach(function (line, i) {
          assert.strictEqual(lines[i], line);
        });

        assert.strictEqual(res.code, 1);
        done();
      }
    );
  });

  it('should exit early if test passes', function (done) {
    runJSON('retries/early-pass.fixture.js', args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('to have failed test count', 0)
        .and('to have retried test', 'should pass after 1 retry', 1);

      done();
    });
  });

  it('should let test override', function (done) {
    runJSON('retries/nested.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.passes, 0);
      assert.strictEqual(res.stats.failures, 1);
      assert.strictEqual(res.stats.tests, 1);
      assert.strictEqual(res.tests[0].currentRetry, 1);
      assert.strictEqual(res.code, 1);
      done();
    });
  });

  it('should not hang w/ async test', function (done) {
    helpers.runMocha(
      'retries/async.fixture.js',
      ['--reporter', 'dot'],
      function (err, res) {
        var lines, expected;

        if (err) {
          done(err);
          return;
        }

        lines = res.output
          .split(helpers.SPLIT_DOT_REPORTER_REGEXP)
          .map(function (line) {
            return line.trim();
          })
          .filter(function (line) {
            return line.length;
          })
          .slice(0, -1);

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

        expected.forEach(function (line, i) {
          assert.strictEqual(lines[i], line);
        });

        assert.strictEqual(res.code, 0);
        done();
      }
    );
  });
});
