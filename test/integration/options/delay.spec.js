'use strict';

const path = require('node:path').posix;
const helpers = require('../helpers');
const runMochaJSON = helpers.runMochaJSON;

describe('--delay', function () {
  let args = [];

  before(function () {
    args = ['--delay'];
  });

  it('should run the generated test suite', function (done) {
    const fixture = path.join('options', 'delay');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed').and('to have passed test count', 1);
      done();
    });
  });

  it('should execute exclusive tests only', function (done) {
    const fixture = path.join('options', 'delay-only');
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
    const fixture = path.join('options', 'delay-fail');
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
