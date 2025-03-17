'use strict';

var assert = require('node:assert');
var runMocha = require('./helpers').runMocha;
var runMochaJSON = require('./helpers').runMochaJSON;
var SPLIT_DOT_REPORTER_REGEXP = require('./helpers').SPLIT_DOT_REPORTER_REGEXP;
var args = ['--reporter', 'dot'];

describe('hooks', function () {
  it('are ran in correct order', function (done) {
    runMocha('cascade.fixture.js', args, function (err, res) {
      var lines, expected;

      if (err) {
        done(err);
        return;
      }

      lines = res.output
        .split(SPLIT_DOT_REPORTER_REGEXP)
        .map(function (line) {
          return line.trim();
        })
        .filter(function (line) {
          return line.length;
        })
        .slice(0, -1);

      expected = [
        'before one',
        'before two',
        'before three',
        'before each one',
        'before each two',
        'before each three',
        'TEST three',
        'after each three',
        'after each two',
        'after each one',
        'after three',
        'after two',
        'after one'
      ];

      expected.forEach(function (line, i) {
        assert.strictEqual(lines[i], line);
      });

      assert.strictEqual(res.code, 0);
      done();
    });
  });

  it('current test title of all hooks', function (done) {
    runMochaJSON('current-test-title.fixture.js', [], function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 3)
        .and('to have passed test order', 'test1 B', 'test1 C', 'test2 C');
      done();
    });
  });
});
