'use strict';

var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--timeout', function() {
  var args = [];

  it("should complete tests having unref'd async behavior", function(done) {
    args = ['--timeout', '0'];
    runMochaJSON('options/timeout-unref', args, function(err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed').and('to have passed test count', 1);
      done();
    });
  });
});
