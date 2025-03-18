'use strict';

const path = require('node:path').posix;
const helpers = require('../helpers');
const runMochaJSON = helpers.runMochaJSON;

describe('--retries', function () {
  let args = [];

  it('should retry test failures after a certain threshold', function (done) {
    args = ['--retries', '3'];
    const fixture = path.join('options', 'retries');
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have failed')
        .and('not to have pending tests')
        .and('not to have passed tests')
        .and('to have retried test', 'should fail', 3);
      done();
    });
  });
});
