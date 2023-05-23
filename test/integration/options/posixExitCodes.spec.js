'use strict';

var helpers = require('../helpers');
var runMocha = helpers.runMocha;

describe('--posix-exit-codes', function () {
  // subprocess
  var mocha;

  function killSubprocess() {
    mocha.kill('SIGKILL');
  }

  // these two handlers deal with a ctrl-c on command-line
  before(function () {
    process.on('SIGINT', killSubprocess);
  });

  after(function () {
    process.removeListener('SIGINT', killSubprocess);
  });

  describe('when enabled with node options', function () {
    it('should exit with code 134 on SIGABRT', function (done) {
      var fixture = 'posix-exit-codes.fixture.js';
      var args = ['--no-warnings', '--posix-exit-codes'];
      mocha = runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', 134);
        done();
      });
    });
  });
});
