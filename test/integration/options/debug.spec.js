'use strict';

var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;
var DEFAULT_FIXTURE = helpers.DEFAULT_FIXTURE;

describe('--debug', function() {
  describe('Node.js v8+', function() {
    before(function() {
      if (process.version.substring(0, 2) === 'v6') {
        this.skip();
      }
    });

    it('should invoke --inspect', function(done) {
      invokeMocha(
        ['--debug', '--file', DEFAULT_FIXTURE],
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have passed').and(
            'to contain output',
            /Debugger listening/i
          );
          done();
        },
        {stdio: 'pipe'}
      );
    });
  });
});
