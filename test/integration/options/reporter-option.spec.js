'use strict';

var runMocha = require('../helpers').runMocha;

describe('--reporter-option', function() {
  describe('when given options w/ invalid format', function() {
    it('should display an error', function(done) {
      runMocha(
        'passing.fixture.js',
        ['--reporter-option', 'foo=bar=baz'],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed').and(
            'to contain output',
            /invalid reporter option/i
          );
          done();
        },
        'pipe'
      );
    });
  });
});
