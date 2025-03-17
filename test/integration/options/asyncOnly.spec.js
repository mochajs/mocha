'use strict';

const path = require('node:path').posix;
const helpers = require('../helpers');
const runMochaJSON = helpers.runMochaJSON;

describe('--async-only', function () {
  let args = [];

  before(function () {
    args = ['--async-only'];
  });

  it('should fail synchronous specs', function (done) {
    const fixture = path.join('options', 'async-only-sync');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have failed');
      done();
    });
  });

  it('should allow asynchronous specs', function (done) {
    const fixture = path.join('options', 'async-only-async');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed');
      done();
    });
  });
});
