'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--dry-run', function () {
  var args = ['--dry-run'];

  it('should only report, but not execute any test', function (done) {
    var fixture = path.join('options/dry-run', 'dry-run');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed')
        .and(
          'to have passed tests',
          'test2 - report as passed',
          'test3 - report as passed',
          'test4 - report as passed'
        )
        .and('to have passed test count', 3)
        .and('to have pending test count', 1)
        .and('to have failed test count', 0);
      done();
    });
  });

  it('should pass without "RangeError: maximum call stack size exceeded"', function (done) {
    var fixture = path.join('options/dry-run', 'stack-size');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed test count', 400);
      done();
    });
  });
});
