'use strict';

const helpers = require('../helpers');
const runMochaJSON = helpers.runMochaJSON;

describe('--fail-zero', function () {
  const args = ['--fail-zero', '--grep', 'yyyyyy'];

  it('should fail since no tests are encountered', function (done) {
    const fixture = '__default__.fixture.js';
    runMochaJSON(fixture, args, function (err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed test count', 0)
        .and('to have test count', 0)
        .and('to have exit code', 1);
      done();
    });
  });
});
