'use strict';

var path = require('path');
var assert = require('assert');
var helpers = require('./helpers');
var run = helpers.runMochaJSON;
var directInvoke = helpers.invokeMocha;
var resolvePath = helpers.resolveFixturePath;
var args = [];

describe('options', function () {
  describe('--async-only', function () {
    before(function () {
      args = ['--async-only'];
    });

    it('should fail synchronous specs', function (done) {
      run('options/async-only-sync.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.failures[0].title, 'throws an error');
        assert.equal(res.code, 1);
        done();
      });
    });

    it('should allow asynchronous specs', function (done) {
      run('options/async-only-async.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 1);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].title, 'should pass');
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('--bail', function () {
    before(function () {
      args = ['--bail'];
    });

    it('should stop after the first error', function (done) {
      run('options/bail.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 1);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.passes[0].title, 'should display this spec');
        assert.equal(res.failures[0].title, 'should only display this error');
        assert.equal(res.code, 1);
        done();
      });
    });
  });

  describe('--sort', function () {
    before(function () {
      args = ['--sort'];
    });

    it('should sort tests in alphabetical order', function (done) {
      run('options/sort*', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].fullTitle,
          'alpha should be executed first');
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('--file', function () {
    it('should run tests passed via file first', function (done) {
      args = ['--file', resolvePath('options/file-alpha.fixture.js')];

      run('options/file-beta.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].fullTitle,
          'alpha should be executed first');
        assert.equal(res.code, 0);
        done();
      });
    });

    it('should run multiple tests passed via file first', function (done) {
      args = [
        '--file', resolvePath('options/file-alpha.fixture.js'),
        '--file', resolvePath('options/file-beta.fixture.js')
      ];

      run('options/file-theta.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 3);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].fullTitle,
          'alpha should be executed first');
        assert.equal(res.passes[1].fullTitle,
          'beta should be executed second');
        assert.equal(res.passes[2].fullTitle,
          'theta should be executed third');
        assert.equal(res.code, 0);
        done();
      });
    });
  });

  describe('--delay', function () {
    before(function () {
      args = ['--delay'];
    });

    it('should run the generated test suite', function (done) {
      run('options/delay.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 1);
        assert.equal(res.stats.failures, 0);

        assert.equal(res.passes[0].title,
          'should have no effect if attempted twice in the same suite');
        assert.equal(res.code, 0);
        done();
      });
    });

    it('should throw an error if the test suite failed to run', function (done) {
      run('options/delay-fail.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.failures, 1);

        assert.equal(res.failures[0].title,
          'Uncaught error outside test suite');
        assert.equal(res.code, 1);
        done();
      });
    });
  });

  describe('--grep', function () {
    it('runs specs matching a string', function (done) {
      args = ['--grep', 'match'];
      run('options/grep.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 2);
        assert.equal(res.stats.failures, 0);
        assert.equal(res.code, 0);
        done();
      });
    });

    describe('runs specs matching a RegExp', function () {
      it('with RegExp like strings(pattern follow by flag)', function (done) {
        args = ['--grep', '/match/i'];
        run('options/grep.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 4);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });

      it('string as pattern', function (done) {
        args = ['--grep', '.*'];
        run('options/grep.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 4);
          assert.equal(res.stats.failures, 1);
          assert.equal(res.code, 1);
          done();
        });
      });
    });

    describe('with --invert', function () {
      it('runs specs that do not match the pattern', function (done) {
        args = ['--grep', 'fail', '--invert'];
        run('options/grep.fixture.js', args, function (err, res) {
          if (err) {
            done(err);
            return;
          }
          assert.equal(res.stats.pending, 0);
          assert.equal(res.stats.passes, 4);
          assert.equal(res.stats.failures, 0);
          assert.equal(res.code, 0);
          done();
        });
      });
    });
  });

  describe('--retries', function () {
    it('retries after a certain threshold', function (done) {
      args = ['--retries', '3'];
      run('options/retries.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.stats.pending, 0);
        assert.equal(res.stats.passes, 0);
        assert.equal(res.stats.tests, 1);
        assert.equal(res.tests[0].currentRetry, 3);
        assert.equal(res.stats.failures, 1);
        assert.equal(res.code, 1);
        done();
      });
    });
  });

  describe('--forbid-only', function () {
    var onlyErrorMessage = '`.only` forbidden';

    before(function () {
      args = ['--forbid-only'];
    });

    it('succeeds if there are only passed tests', function (done) {
      run('options/forbid-only/passed.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.code, 0);
        done();
      });
    });

    it('fails if there are tests marked only', function (done) {
      run('options/forbid-only/only.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.code, 1);
        assert.equal(res.failures[0].err.message, onlyErrorMessage);
        done();
      });
    });

    it('fails if there are tests in suites marked only', function (done) {
      run('options/forbid-only/only-suite.js', args, function (err, res) {
        assert(!err);
        assert.equal(res.code, 1);
        assert.equal(res.failures[0].err.message, onlyErrorMessage);
        done();
      });
    });
  });

  describe('--forbid-pending', function () {
    var pendingErrorMessage = 'Pending test forbidden';

    before(function () {
      args = ['--forbid-pending'];
    });

    it('succeeds if there are only passed tests', function (done) {
      run('options/forbid-pending/passed.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(res.code, 0);
        done();
      });
    });

    var forbidPendingFailureTests = {
      'fails if there are tests marked skip': 'skip.js',
      'fails if there are pending tests': 'pending.js',
      'fails if tests call `skip()`': 'this.skip.js',
      'fails if beforeEach calls `skip()`': 'beforeEach-this.skip.js',
      'fails if before calls `skip()`': 'before-this.skip.js',
      'fails if there are tests in suites marked skip': 'skip-suite.js'
    };

    Object.keys(forbidPendingFailureTests).forEach(function (title) {
      it(title, function (done) {
        run(path.join('options', 'forbid-pending', forbidPendingFailureTests[title]),
          args,
          function (err, res) {
            if (err) {
              done(err);
              return;
            }
            assert.equal(res.code, 1);
            assert.equal(res.failures[0].err.message, pendingErrorMessage);
            done();
          });
      });
    });
  });

  describe('--exit', function () {
    var behaviors = {
      enabled: '--exit',
      disabled: '--no-exit'
    };

    /**
     * Returns a test that executes Mocha in a subprocess with either
     * `--exit`, `--no-exit`, or default behavior.
     * @param {boolean} shouldExit - Expected result; `true` if Mocha should
     *   have force-killed the process.
     * @param {string} [behavior] - 'enabled' or 'disabled'
     * @returns {Function}
     */
    var runExit = function (shouldExit, behavior) {
      return function (done) {
        this.timeout(0);
        this.slow(3000);
        var didExit = true;
        var t;
        var args = behaviors[behavior] ? [behaviors[behavior]] : [];

        var mocha = run('exit.fixture.js', args, function (err) {
          clearTimeout(t);
          if (err) {
            done(err);
            return;
          }
          expect(didExit).to.equal(shouldExit);
          done();
        });

        // if this callback happens, then Mocha didn't automatically exit.
        t = setTimeout(function () {
          didExit = false;
          // this is the only way to kill the child, afaik.
          // after the process ends, the callback to `run()` above is handled.
          mocha.kill('SIGINT');
        }, 2000);
      };
    };

    describe('default behavior', function () {
      it('should force exit after root suite completion', runExit(false));
    });

    describe('with exit enabled', function () {
      it('should force exit after root suite completion', runExit(true, 'enabled'));
    });

    describe('with exit disabled', function () {
      it('should not force exit after root suite completion', runExit(false, 'disabled'));
    });
  });

  describe('--help', function () {
    it('works despite the presence of mocha.opts', function (done) {
      directInvoke(['-h'], function (error, result) {
        if (error) {
          return done(error);
        }
        expect(result.output).to.contain('Usage:');
        done();
      }, path.join(__dirname, 'fixtures', 'options', 'help'));
    });
  });
});
