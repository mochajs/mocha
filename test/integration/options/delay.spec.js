'use strict';

var path = require('node:path').posix;
var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--delay', function () {
  var args = [];

  before(function () {
    args = ['--delay'];
  });

  it('should run the generated test suite', function (done) {
    var fixture = path.join('options', 'delay');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed').and('to have passed test count', 1);
      done();
    });
  });

  it('should execute exclusive tests only', function (done) {
    var fixture = path.join('options', 'delay-only');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and(
          'to have passed test order',
          'should run this',
          'should run this, too'
        );
      done();
    });
  });

  it('should throw an error if the test suite failed to run', function (done) {
    var fixture = path.join('options', 'delay-fail');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed').and(
        'to have failed test',
        'Uncaught error outside test suite'
      );
      done();
    });
  });
});
