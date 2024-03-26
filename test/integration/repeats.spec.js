'use strict';

var assert = require('assert');
var helpers = require('./helpers');
var runJSON = helpers.runMochaJSON;
var args = [];
var bang = require('../../lib/reporters/base').symbols.bang;

describe('repeats', function () {
  it('are ran in correct order', function (done) {
    helpers.runMocha(
      'repeats/hooks.fixture.js',
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

  it('should exit early if test fails', function (done) {
    runJSON('repeats/early-fail.fixture.js', args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed')
        .and('to have passed test count', 0)
        .and('to have failed test count', 1)
        .and('to have repeated test', 'should fail on the second attempt', 2);

      done();
    });
  });

  it('should let test override', function (done) {
    runJSON('repeats/nested.fixture.js', args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      assert.strictEqual(res.stats.passes, 1);
      assert.strictEqual(res.stats.failures, 0);
      assert.strictEqual(res.stats.tests, 1);
      assert.strictEqual(res.tests[0].currentRepeat, 1);
      assert.strictEqual(res.code, 0);
      done();
    });
  });

  it('should not hang w/ async test', function (done) {
    this.timeout(2500);
    helpers.runMocha(
      'repeats/async.fixture.js',
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
          bang + 'after each 4',
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
});
