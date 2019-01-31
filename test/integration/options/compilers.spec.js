'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;

describe('--compilers', function() {
  var args = [];

  before(function() {
    args = ['--compilers', 'coffee:coffee-script/register'];
  });

  it('should fail', function(done) {
    invokeMocha(args, function(err, res) {
      if (err) {
        return done(err);
      }

      expect(res.code, 'to be', 1);
      done();
    });
  });
});
