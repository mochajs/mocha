'use strict';

var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--fail-on-failing-test-suite', function() {
  var args = ['--fail-on-failing-test-suite=false'];

  it('should success', function(done) {
    var fixture = 'require-undefined.fixture.js';
    runMochaJSON(fixture, args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res, 'to have passed test count', 0)
        .and('to have test count', 1)
        .and('to have exit code', 0);
      done();
    });
  });
});
