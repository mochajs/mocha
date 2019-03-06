'use strict';

var runMocha = require('../helpers').runMocha;

describe('--invert', function() {
  describe('when used without --fgrep or --grep', function() {
    it('it should report an error', function(done) {
      runMocha(
        'options/grep',
        ['--invert'],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(
            res,
            'to have failed with output',
            /--invert.*--grep <regexp>/
          );
          done();
        },
        'pipe'
      );
    });
  });
});
