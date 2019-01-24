'use strict';

var invokeMocha = require('./helpers').invokeMocha;

describe('invalid arguments', function() {
  it('should exit with failure if arguments are invalid', function(done) {
    invokeMocha(
      ['--ui'],
      function(err, result) {
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
