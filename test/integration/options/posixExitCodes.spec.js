'use strict';

var helpers = require('../helpers');
var runMocha = helpers.runMocha;

describe('--posix-exit-codes', function () {
  describe('when enabled with node options', function () {
    var args = ['--no-warnings', '--posix-exit-codes'];

    it('should exit with code 134 on SIGABRT', function (done) {
      var fixture = 'signals-sigabrt.fixture.js';
      runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', 134);
        done();
      });
    });

    it('should exit with code 143 on SIGTERM', function (done) {
      var fixture = 'signals-sigterm.fixture.js';
      runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', 143);
        done();
      });
    });
  });

  describe('when not enabled with node options', function () {
    it('should exit with code null on SIGABRT', function (done) {
      var fixture = 'signals-sigabrt.fixture.js';
      var args = ['--no-warnings'];
      runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', null);
        done();
      });
    });

    it('should exit with the number of failed tests', function (done) {
      var fixture = 'failing.fixture.js'; // one failing test
      var args = ['--no-warnings'];
      runMocha(fixture, args, function postmortem(err, res) {
        if (err) {
          return done(err);
        }
        expect(res.code, 'to be', 1);
        done();
      });
    });
  });
});
