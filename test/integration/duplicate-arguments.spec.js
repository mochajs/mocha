'use strict';

var runMochaJSON = require('./helpers').runMochaJSON;

describe('when non-array argument is provided multiple times', function() {
  describe('when the same argument name is used', function() {
    it('should prefer the last value', function(done) {
      runMochaJSON(
        'passing-sync',
        ['--no-async-only', '--async-only', '--no-async-only'],
        function(err, result) {
          if (err) {
            return done(err);
          }
          expect(result, 'to have passed');
          done();
        }
      );
    });
  });

  describe('when a different argument name is used', function() {
    it('should prefer the last value', function(done) {
      runMochaJSON('passing-async', ['--timeout', '100', '-t', '10'], function(
        err,
        result
      ) {
        if (err) {
          return done(err);
        }
        expect(result, 'to have failed');
        done();
      });
    });
  });
});
