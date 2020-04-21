'use strict';

var runMocha = require('../helpers').runMocha;

describe('--exit', function() {
  var behaviors = {
    enabled: '--exit',
    disabled: '--no-exit'
  };

  // subprocess
  var mocha;

  function killSubprocess() {
    mocha.kill('SIGKILL');
  }

  // these two handlers deal with a ctrl-c on command-line
  before(function() {
    process.on('SIGINT', killSubprocess);
  });

  after(function() {
    process.removeListener('SIGINT', killSubprocess);
  });

  /**
   * Returns a test that executes Mocha in a subprocess with either
   * `--exit`, `--no-exit`, or default behavior.
   *
   * @param {boolean} shouldExit - Expected result; `true` if Mocha should
   *   have force-killed the process.
   * @param {"enabled"|"disabled"} [behavior] - 'enabled' or 'disabled'; omit for default
   * @returns {Function} async function implementing the test
   */
  var runExit = function(shouldExit, behavior) {
    return function(done) {
      var timeout = this.timeout();
      this.timeout(0);
      this.slow(Infinity);

      var didExit = true;
      var timeoutObj;
      var fixture = 'exit.fixture.js';
      var args = behaviors[behavior] ? [behaviors[behavior]] : [];
      mocha = runMocha(fixture, args, function postmortem(err) {
        clearTimeout(timeoutObj);
        if (err) {
          return done(err);
        }
        expect(didExit, 'to be', shouldExit);
        done();
      });

      // If this callback happens, then Mocha didn't automatically exit.
      timeoutObj = setTimeout(function() {
        didExit = false;
        killSubprocess();
      }, timeout - 500);
    };
  };

  describe('default behavior', function() {
    it('should not force exit after root suite completion', runExit(false));
  });

  describe('when enabled', function() {
    it(
      'should force exit after root suite completion',
      runExit(true, 'enabled')
    );
  });

  describe('when disabled', function() {
    it(
      'should not force exit after root suite completion',
      runExit(false, 'disabled')
    );
  });
});
