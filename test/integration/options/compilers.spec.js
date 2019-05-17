'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;

describe('--compilers', function() {
  it('should report deprecation', function(done) {
    invokeMocha(
      ['--compilers', 'coffee:coffee-script/register'],
      function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res, 'to have failed with output', /compilers is deprecated/i);
        done();
      },
      'pipe'
    );
  });
});
