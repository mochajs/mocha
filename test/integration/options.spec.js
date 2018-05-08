'use strict';

var path = require('path');
var helpers = require('./helpers');
var run = helpers.runMochaJSON;
var directInvoke = helpers.invokeMocha;
var resolvePath = helpers.resolveFixturePath;
var args = [];

describe('options', function() {
  describe('--async-only', function() {
    before(function() {
      args = ['--async-only'];
    });

    it('should fail synchronous specs', function(done) {
      run('options/async-only-sync.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed');
        done();
      });
    });

    it('should allow asynchronous specs', function(done) {
      run('options/async-only-async.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      });
    });
  });

  describe('--bail', function() {
    before(function() {
      args = ['--bail'];
    });

    it('should stop after the first error', function(done) {
      run('options/bail.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        expect(res, 'to have failed')
          .and('to have passed test', 'should display this spec')
          .and('to have failed test', 'should only display this error')
          .and('to have passed test count', 1);
        done();
      });
    });

    it('should stop all tests after the first error in before hook', function(done) {
      run('options/bail-with-before.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and('to have failed test', '"before all" hook');
        done();
      });
    });

    it('should stop all hooks after the first error', function(done) {
      run('options/bail-with-after.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and('to have run test', 'should only display this error');
        done();
      });
    });
  });

  describe('--sort', function() {
    before(function() {
      args = ['--sort'];
    });

    it('should sort tests in alphabetical order', function(done) {
      run('options/sort*', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed test count', 2).and(
          'to have passed test order',
          'should be executed first'
        );
        done();
      });
    });
  });

  describe('--file', function() {
    it('should run tests passed via file first', function(done) {
      args = ['--file', resolvePath('options/file-alpha.fixture.js')];

      run('options/file-beta.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 2)
          .and('to have passed test order', 'should be executed first');
        done();
      });
    });

    it('should run multiple tests passed via file first', function(done) {
      args = [
        '--file',
        resolvePath('options/file-alpha.fixture.js'),
        '--file',
        resolvePath('options/file-beta.fixture.js')
      ];

      run('options/file-theta.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 3)
          .and(
            'to have passed test order',
            'should be executed first',
            'should be executed second',
            'should be executed third'
          );
        done();
      });
    });
  });

  describe('--delay', function() {
    before(function() {
      args = ['--delay'];
    });

    it('should run the generated test suite', function(done) {
      run('options/delay.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed').and('to have passed test count', 1);
        done();
      });
    });

    it('should execute exclusive tests only', function(done) {
      run('options/delay-only.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 2)
          .and(
            'to have passed test order',
            'should run this',
            'should run this, too'
          );
        done();
      });
    });

    it('should throw an error if the test suite failed to run', function(done) {
      run('options/delay-fail.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed').and(
          'to have failed test',
          'Uncaught error outside test suite'
        );
        done();
      });
    });
  });

  describe('--grep', function() {
    it('runs specs matching a string', function(done) {
      args = ['--grep', 'match'];
      run('options/grep.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed')
          .and('to have passed test count', 2)
          .and('not to have pending tests');
        done();
      });
    });

    describe('runs specs matching a RegExp', function() {
      it('with RegExp like strings(pattern follow by flag)', function(done) {
        args = ['--grep', '/match/i'];
        run('options/grep.fixture.js', args, function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed')
            .and('to have passed test count', 4)
            .and('not to have pending tests');
          done();
        });
      });

      it('string as pattern', function(done) {
        args = ['--grep', '.*'];
        run('options/grep.fixture.js', args, function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have failed')
            .and('to have passed test count', 4)
            .and('to have failed test count', 1)
            .and('not to have pending tests');
          done();
        });
      });
    });

    describe('with --invert', function() {
      it('runs specs that do not match the pattern', function(done) {
        args = ['--grep', 'fail', '--invert'];
        run('options/grep.fixture.js', args, function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed')
            .and('to have passed test count', 4)
            .and('not to have pending tests');
          done();
        });
      });
    });
  });

  describe('--retries', function() {
    it('retries after a certain threshold', function(done) {
      args = ['--retries', '3'];
      run('options/retries.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('not to have pending tests')
          .and('not to have passed tests')
          .and('to have retried test', 'should fail', 3);
        done();
      });
    });
  });

  describe('--forbid-only', function() {
    var onlyErrorMessage = '`.only` forbidden';

    before(function() {
      args = ['--forbid-only'];
    });

    it('succeeds if there are only passed tests', function(done) {
      run('options/forbid-only/passed.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      });
    });

    it('fails if there are tests marked only', function(done) {
      run('options/forbid-only/only.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed with error', onlyErrorMessage);
        done();
      });
    });

    it('fails if there are tests in suites marked only', function(done) {
      run('options/forbid-only/only-suite.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed with error', onlyErrorMessage);
        done();
      });
    });
  });

  describe('--forbid-pending', function() {
    var pendingErrorMessage = 'Pending test forbidden';

    before(function() {
      args = ['--forbid-pending'];
    });

    it('succeeds if there are only passed tests', function(done) {
      run('options/forbid-pending/passed.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
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

    Object.keys(forbidPendingFailureTests).forEach(function(title) {
      it(title, function(done) {
        run(
          path.join(
            'options',
            'forbid-pending',
            forbidPendingFailureTests[title]
          ),
          args,
          function(err, res) {
            if (err) {
              done(err);
              return;
            }
            expect(res, 'to have failed with error', pendingErrorMessage);
            done();
          }
        );
      });
    });
  });

  describe('--exit', function() {
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
    var runExit = function(shouldExit, behavior) {
      return function(done) {
        this.timeout(0);
        this.slow(3000);
        var didExit = true;
        var t;
        var args = behaviors[behavior] ? [behaviors[behavior]] : [];

        var mocha = run('exit.fixture.js', args, function(err) {
          clearTimeout(t);
          if (err) {
            done(err);
            return;
          }
          expect(didExit, 'to be', shouldExit);
          done();
        });

        // if this callback happens, then Mocha didn't automatically exit.
        t = setTimeout(function() {
          didExit = false;
          // this is the only way to kill the child, afaik.
          // after the process ends, the callback to `run()` above is handled.
          mocha.kill('SIGINT');
        }, 2000);
      };
    };

    describe('default behavior', function() {
      it('should force exit after root suite completion', runExit(false));
    });

    describe('with exit enabled', function() {
      it(
        'should force exit after root suite completion',
        runExit(true, 'enabled')
      );
    });

    describe('with exit disabled', function() {
      it(
        'should not force exit after root suite completion',
        runExit(false, 'disabled')
      );
    });
  });

  describe('--help', function() {
    it('works despite the presence of mocha.opts', function(done) {
      directInvoke(
        ['-h'],
        function(error, result) {
          if (error) {
            return done(error);
          }
          expect(result.output, 'to contain', 'Usage:');
          done();
        },
        path.join(__dirname, 'fixtures', 'options', 'help')
      );
    });
  });

  describe('--exclude', function() {
    /*
     * Runs mocha in {path} with the given args.
     * Calls handleResult with the result.
     */
    function runMochaTest(fixture, args, handleResult, done) {
      run(fixture, args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        handleResult(res);
        done();
      });
    }

    it('should exclude specific files', function(done) {
      runMochaTest(
        'options/exclude/*.fixture.js',
        [
          '--exclude',
          'test/integration/fixtures/options/exclude/fail.fixture.js'
        ],
        function(res) {
          expect(res, 'to have passed')
            .and('to have run test', 'should find this test')
            .and('not to have pending tests');
        },
        done
      );
    });

    it('should exclude globbed files', function(done) {
      runMochaTest(
        'options/exclude/**/*.fixture.js',
        ['--exclude', '**/fail.fixture.js'],
        function(res) {
          expect(res, 'to have passed')
            .and('not to have pending tests')
            .and('to have passed test count', 2);
        },
        done
      );
    });

    it('should exclude multiple patterns', function(done) {
      runMochaTest(
        'options/exclude/**/*.fixture.js',
        [
          '--exclude',
          'test/integration/fixtures/options/exclude/fail.fixture.js',
          '--exclude',
          'test/integration/fixtures/options/exclude/nested/fail.fixture.js'
        ],
        function(res) {
          expect(res, 'to have passed')
            .and('not to have pending tests')
            .and('to have passed test count', 2);
        },
        done
      );
    });
  });
});
