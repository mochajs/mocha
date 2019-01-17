'use strict';

var path = require('path');
var helpers = require('./helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;
var runMochaJSONRaw = helpers.runMochaJSONRaw;
var invokeMocha = helpers.invokeMocha;
var resolvePath = helpers.resolveFixturePath;
var toJSONRunResult = helpers.toJSONRunResult;
var args = [];

describe('options', function() {
  describe('--async-only', function() {
    before(function() {
      args = ['--async-only'];
    });

    it('should fail synchronous specs', function(done) {
      runMochaJSON('options/async-only-sync.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed');
        done();
      });
    });

    it('should allow asynchronous specs', function(done) {
      runMochaJSON('options/async-only-async.fixture.js', args, function(
        err,
        res
      ) {
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
      runMochaJSON('options/bail.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        expect(res, 'to have failed')
          .and('to have passed test', 'should display this spec')
          .and('to have failed test', 'should only display this error')
          .and('to have passed test count', 1)
          .and('to have failed test count', 1);
        done();
      });
    });

    it('should stop after the first error - async', function(done) {
      runMochaJSON('options/bail-async.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }

        expect(res, 'to have failed')
          .and('to have passed test', 'should display this spec')
          .and('to have failed test', 'should only display this error')
          .and('to have passed test count', 1)
          .and('to have failed test count', 1);
        done();
      });
    });

    it('should stop all tests after failing "before" hook', function(done) {
      runMochaJSON('options/bail-with-before.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and('to have failed test', '"before all" hook: before suite1')
          .and('to have passed test count', 0);
        done();
      });
    });

    it('should stop all tests after failing "beforeEach" hook', function(done) {
      runMochaJSON('options/bail-with-beforeEach.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and(
            'to have failed test',
            '"before each" hook: beforeEach suite1 for "test suite1"'
          )
          .and('to have passed test count', 0);
        done();
      });
    });

    it('should stop all tests after failing test', function(done) {
      runMochaJSON('options/bail-with-test.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and('to have failed test', 'test suite1')
          .and('to have passed test count', 0);
        done();
      });
    });

    it('should stop all tests after failing "after" hook', function(done) {
      runMochaJSON('options/bail-with-after.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and('to have failed test', '"after all" hook: after suite1A')
          .and('to have passed test count', 2)
          .and('to have passed test order', 'test suite1', 'test suite1A');
        done();
      });
    });

    it('should stop all tests after failing "afterEach" hook', function(done) {
      runMochaJSON('options/bail-with-afterEach.fixture.js', args, function(
        err,
        res
      ) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed')
          .and('to have failed test count', 1)
          .and(
            'to have failed test',
            '"after each" hook: afterEach suite1A for "test suite1A"'
          )
          .and('to have passed test count', 2)
          .and('to have passed test order', 'test suite1', 'test suite1A');
        done();
      });
    });
  });

  describe('--sort', function() {
    before(function() {
      args = ['--sort'];
    });

    it('should sort tests in alphabetical order', function(done) {
      runMochaJSON('options/sort*', args, function(err, res) {
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

      runMochaJSON('options/file-beta.fixture.js', args, function(err, res) {
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

      runMochaJSON('options/file-theta.fixture.js', args, function(err, res) {
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
      runMochaJSON('options/delay.fixture.js', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed').and('to have passed test count', 1);
        done();
      });
    });

    it('should execute exclusive tests only', function(done) {
      runMochaJSON('options/delay-only.fixture.js', args, function(err, res) {
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
      runMochaJSON('options/delay-fail.fixture.js', args, function(err, res) {
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
      runMochaJSON('options/grep.fixture.js', args, function(err, res) {
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
        runMochaJSON('options/grep.fixture.js', args, function(err, res) {
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
        runMochaJSON('options/grep.fixture.js', args, function(err, res) {
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
        runMochaJSON('options/grep.fixture.js', args, function(err, res) {
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

      it('should throw an error when `--invert` used in isolation', function(done) {
        args = ['--invert'];
        runMocha(
          'options/grep.fixture.js',
          args,
          function(err, res) {
            if (err) {
              done(err);
              return;
            }
            expect(res, 'to satisfy', {
              code: 1,
              output: /--invert.*--grep <regexp>/
            });
            done();
          },
          {stdio: 'pipe'}
        );
      });
    });
  });

  describe('--retries', function() {
    it('retries after a certain threshold', function(done) {
      args = ['--retries', '3'];
      runMochaJSON('options/retries.fixture.js', args, function(err, res) {
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
      runMochaJSON('options/forbid-only/passed', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      });
    });

    it('fails if there are tests marked only', function(done) {
      runMochaJSON('options/forbid-only/only', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have failed with error', onlyErrorMessage);
        done();
      });
    });

    it('fails if there are tests in suites marked only', function(done) {
      runMocha(
        'options/forbid-only/only-suite',
        args,
        function(err, res) {
          if (err) {
            done(err);
            return;
          }

          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(onlyErrorMessage)
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    it('fails if there is empty suite marked only', function(done) {
      runMocha(
        'options/forbid-only/only-empty-suite',
        args,
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(onlyErrorMessage)
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    it('fails if there is suite marked only which matches a grep', function(done) {
      runMocha(
        'options/forbid-only/only-suite',
        args.concat('--fgrep', 'suite marked with only'),
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(onlyErrorMessage)
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    it('succeeds if suite marked only does not match grep', function(done) {
      runMochaJSON(
        'options/forbid-only/only-suite',
        args.concat('--fgrep', 'bumble bees'),
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed');
          done();
        }
      );
    });

    it('succeeds if suite marked only does not match grep (using "invert")', function(done) {
      runMochaJSON(
        'options/forbid-only/only-suite',
        args.concat('--fgrep', 'suite marked with only', '--invert'),
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to have passed');
          done();
        }
      );
    });
  });

  describe('--forbid-pending', function() {
    var pendingErrorMessage = 'Pending test forbidden';

    before(function() {
      args = ['--forbid-pending'];
    });

    it('succeeds if there are only passed tests', function(done) {
      runMochaJSON('options/forbid-pending/passed', args, function(err, res) {
        if (err) {
          done(err);
          return;
        }
        expect(res, 'to have passed');
        done();
      });
    });

    it('fails if there are tests in suites marked skip', function(done) {
      runMocha(
        'options/forbid-pending/skip-suite',
        args,
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(pendingErrorMessage)
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    it('fails if there is empty suite marked pending', function(done) {
      runMocha(
        'options/forbid-pending/skip-empty-suite',
        args,
        function(err, res) {
          if (err) {
            done(err);
            return;
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(pendingErrorMessage)
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    var forbidPendingFailureTests = {
      'fails if there are tests marked skip': 'skip',
      'fails if there are pending tests': 'pending',
      'fails if tests call `skip()`': 'this-skip',
      'fails if beforeEach calls `skip()`': 'beforeEach-this-skip',
      'fails if before calls `skip()`': 'before-this-skip'
    };

    Object.keys(forbidPendingFailureTests).forEach(function(title) {
      it(title, function(done) {
        runMochaJSON(
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
        var timeout = this.timeout();
        this.timeout(0);
        this.slow(Infinity);
        var didExit = true;
        var t;
        var args = behaviors[behavior] ? [behaviors[behavior]] : [];

        var mocha = runMochaJSON('exit.fixture.js', args, function(err) {
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
        }, timeout - 500);
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
      invokeMocha(
        ['-h'],
        function(error, result) {
          if (error) {
            return done(error);
          }
          expect(result.output, 'to contain', 'Run tests with Mocha');
          done();
        },
        {cwd: path.join(__dirname, 'fixtures', 'options', 'help')}
      );
    });
  });

  describe('--opts', function() {
    var testFile = path.join('options', 'opts.fixture.js');

    it('works despite nonexistent default options file', function(done) {
      args = [];
      runMochaJSON(testFile, args, function(err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have passed').and('to have passed test count', 1);
        return done();
      });
    });

    it('should throw an error due to nonexistent options file', function(done) {
      args = ['--opts', 'nosuchoptionsfile', testFile];
      invokeMocha(
        args,
        function(err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to satisfy', {
            code: 1,
            output: /unable to read nosuchoptionsfile/i
          });
          return done();
        },
        {cwd: path.join(__dirname, 'fixtures'), stdio: 'pipe'}
      );
    });
  });

  describe('--exclude', function() {
    /*
     * Runs mocha in {path} with the given args.
     * Calls handleResult with the result.
     */
    function runMochaTest(fixture, args, handleResult, done) {
      runMochaJSON(fixture, args, function(err, res) {
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

  if (process.platform !== 'win32') {
    // Windows: Feature works but SIMULATING the signal (ctr+c), via child process, does not work
    // due to lack of *nix signal compliance.
    describe('--watch', function() {
      describe('with watch enabled', function() {
        it('should show the cursor and signal correct exit code, when watch process is terminated', function(done) {
          this.timeout(0);
          this.slow(3000);
          // executes Mocha in a subprocess
          var mocha = runMochaJSONRaw(
            'exit.fixture.js',
            ['--watch'],
            function(err, data) {
              // After the process ends, this callback is ran
              if (err) {
                done(err);
                return;
              }

              var expectedCloseCursor = '\u001b[?25h';
              expect(data.output, 'to contain', expectedCloseCursor);
              expect(data.code, 'to be', 130);
              done();
            },
            {stdio: 'pipe'}
          );
          setTimeout(function() {
            // kill the child process
            mocha.kill('SIGINT');
          }, 1000);
        });
      });
    });
  }

  describe('--compilers', function() {
    it('should fail', function(done) {
      invokeMocha(['--compilers', 'coffee:coffee-script/register'], function(
        error,
        result
      ) {
        if (error) {
          return done(error);
        }
        expect(result.code, 'to be', 1);
        done();
      });
    });
  });

  describe('--fgrep and --grep', function() {
    it('should conflict', function(done) {
      runMocha(
        'uncaught.fixture.js',
        ['--fgrep', 'first', '--grep', 'second'],
        function(err, result) {
          if (err) {
            return done(err);
          }
          expect(result, 'to have failed');
          done();
        }
      );
    });
  });

  describe('--extension', function() {
    it('should allow comma-separated variables', function(done) {
      invokeMocha(
        [
          '--require',
          'coffee-script/register',
          '--require',
          './test/setup',
          '--reporter',
          'json',
          '--extension',
          'js,coffee',
          'test/integration/fixtures/options/extension'
        ],
        function(err, result) {
          if (err) {
            return done(err);
          }
          expect(toJSONRunResult(result), 'to have passed').and(
            'to have passed test count',
            2
          );
          done();
        }
      );
    });
  });
});
