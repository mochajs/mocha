'use strict';

var helpers = require('../helpers');
var runMochaJSON = helpers.runMochaJSON;

describe('--exit', function() {
  var behaviors = {
    enabled: '--exit',
    disabled: '--no-exit'
  };

  /**
   * Returns a test that executes Mocha in a subprocess with either
   * `--exit`, `--no-exit`, or default behavior.
   *
   * @param {boolean} shouldExit - Expected result; `true` if Mocha should
   *   have force-killed the process.
   * @param {string} [behavior] - 'enabled' or 'disabled'
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

      var mocha = runMochaJSON(fixture, args, function postmortem(err) {
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
        // This is the only way to kill the child, afaik.
        // After the process ends, the callback to `run()` above is handled.
        mocha.kill('SIGINT');
      }, timeout - 500);
    };
  };

  describe('default behavior', function() {
    it('should force exit after root suite completion', runExit(false));
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
