'use strict';

var invokeMocha = require('../helpers').invokeMocha;

describe('--opts', function() {
  it('should report deprecation', function(done) {
    invokeMocha(
      ['--opts', './test/mocha.opts'],
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(
          res,
          'to have failed with output',
          /'mocha.opts' is DEPRECATED/i
        );
        done();
      },
      'pipe'
    );
  });
});
