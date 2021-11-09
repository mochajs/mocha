'use strict';

var invokeMocha = require('./helpers').invokeMocha;

describe('invalid arguments', function () {
  describe('when argument is missing required value', function () {
    it('should exit with failure', function (done) {
      invokeMocha(
        ['--ui'],
        function (err, result) {
          if (err) {
            return done(err);
          }
          expect(result, 'to have failed');
          expect(result.output, 'to match', /not enough arguments/i);
          done();
        },
        {stdio: 'pipe'}
      );
    });
  });
});
