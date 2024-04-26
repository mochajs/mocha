'use strict';

var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var os = require('os');

const EXIT_SUCCESS = 0;
const EXIT_FAILURE = 1;
const SIGNAL_OFFSET = 128;

describe('--posix-exit-codes', function () {
  if (os.platform() !== 'win32') { // SIGTERM is not supported on Windows
    describe('when enabled, and with node options', function () {
      var args = ['--no-warnings', '--posix-exit-codes'];

      it('should exit with correct POSIX shell code on SIGABRT', function (done) {
        var fixture = 'signals-sigabrt.fixture.js';
        runMocha(fixture, args, function postmortem(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.code, 'to be', SIGNAL_OFFSET + os.constants.signals.SIGABRT);
          done();
        });
      });

      it('should exit with correct POSIX shell code on SIGTERM', function (done) {
        var fixture = 'signals-sigterm.fixture.js';
        runMocha(fixture, args, function postmortem(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.code, 'to be', SIGNAL_OFFSET + os.constants.signals.SIGTERM);
          done();
        });
      });

      it('should exit with code 1 if there are test failures', function (done) {
        var fixture = 'failing.fixture.js';
        runMocha(fixture, args, function postmortem(err, res) {
          if (err) {
            return done(err);
          }
          expect(res.code, 'to be', EXIT_FAILURE);
          done();
        });
      });
    });
  }

  describe('when not enabled, and with node options', function () {
    it('should exit with the number of failed tests', function (done) {
      var fixture = 'failing.fixture.js'; // contains three failing tests
      var numFailures = 3;
      var args = ['--no-warnings'];
      runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', numFailures);
        done();
      });
    });
  });
});
