'use strict';

var assert = require('assert');
var runMocha = require('./helpers').runMocha;
var splitRegExp = require('./helpers').splitRegExp;
var args = ['--reporter', 'dot'];

describe('hooks', function() {
  it('are ran in correct order', function(done) {
    runMocha('cascade.fixture.js', args, function(err, res) {
      var lines, expected;

      if (err) {
        done(err);
        return;
      }

      lines = res.output
        .split(splitRegExp)
        .map(function(line) {
          return line.trim();
        })
        .filter(function(line) {
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

      expected.forEach(function(line, i) {
        assert.equal(lines[i], line);
      });

      assert.equal(res.code, 0);
      done();
    });
  });
});
