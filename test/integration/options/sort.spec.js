'use strict';

const path = require('node:path').posix;
const helpers = require('../helpers');
const runMochaJSON = helpers.runMochaJSON;

describe('--sort', function () {
  let args = [];

  before(function () {
    args = ['--sort'];
  });

  it('should sort tests in alphabetical order', function (done) {
    const fixtures = path.join('options', 'sort*');
    runMochaJSON(fixtures, args, function (err, res) {
      if (err) {
        done(err);
        return;
      }
      expect(res, 'to have passed test count', 2).and(
        'to have passed test order',
        'should be executed first'
      );
      done();
    });
  });
});
