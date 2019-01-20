'use strict';

var path = require('path');
var helpers = require('../helpers');
var invokeMocha = helpers.invokeMocha;

describe('--help', function() {
  it('should work despite the presence of "mocha.opts"', function(done) {
    var args = ['-h'];
    // :NOTE: Must use platform-specific `path.join` for `spawnOpts.cwd`
    var fixtureDir = path.join(__dirname, '..', 'fixtures', 'options', 'help');
    var spawnOpts = {cwd: fixtureDir};

    invokeMocha(
      args,
      function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.output, 'to contain', 'Run tests with Mocha');
        done();
      },
      spawnOpts
    );
  });
});
