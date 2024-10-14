'use strict';
const Mocha = require('../../../lib/mocha');
const {
  runMochaAsync,
  invokeMochaAsync,
  getSummary,
  resolveFixturePath
} = require('../helpers');
const pidtree = require('pidtree');

const REPORTER_FIXTURE_PATH = resolveFixturePath('options/parallel/test-a');

/**
 * Run a test fixture with the same reporter in both parallel and serial modes,
 * returning both outputs for comparison
 * @param {string} reporter - Reporter name
 * @returns {{actual: import('../helpers').Summary, expected: import('../helpers').Summary}}
 */
async function compareReporters(reporter) {
  const [actual, expected] = await Promise.all([
    runMochaAsync(REPORTER_FIXTURE_PATH, [
      '--reporter',
      reporter,
      '--no-parallel'
    ]),
    runMochaAsync(REPORTER_FIXTURE_PATH, ['--reporter', reporter, '--parallel'])
  ]);

  // the test duration is non-deterministic, so we just fudge it
  actual.output = expected.output = expected.output.replace(/\d+m?s/g, '100ms');

  return {actual, expected};
}

/**
 * Many (but not all) reporters can use this assertion to compare output of serial vs. parallel
 * @param {string} reporter - Reporter name
 */
async function assertReporterOutputEquality(reporter) {
  const {actual, expected} = await compareReporters(reporter);
  return expect(actual, 'to satisfy', {
    passing: expected.passing,
    failing: expected.failing,
    pending: expected.pending,
    code: expected.code,
    output: expected.output
  });
}

/**
 * Polls a process for its list of children PIDs. Returns the first non-empty list found
 * @param {number} pid - Process PID
 * @returns {number[]} Child PIDs
 */
async function waitForChildPids(pid) {
  let childPids = [];
  while (!childPids.length) {
    childPids = await pidtree(pid);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return childPids;
}

describe('--parallel', function () {
  describe('when a test has a syntax error', function () {
    describe('when there is only a single test file', function () {
      it('should fail gracefully', async function () {
        return expect(
          runMochaAsync('options/parallel/syntax-err', ['--parallel']),
          'when fulfilled',
          'to have failed with output',
          /SyntaxError/
        );
      });
    });

    describe('when there are multiple test files', function () {
      it('should fail gracefully', async function () {
        return expect(
          invokeMochaAsync(
            [resolveFixturePath('options/parallel/syntax-err'), '--parallel'],
            'pipe'
          )[1],
          'when fulfilled',
          'to have failed'
        );
      });
    });
  });

  describe('when used with CJS tests', function () {
    it('should have the same result as with --no-parallel', async function () {
      const expected = await runMochaAsync('options/parallel/test-*', [
        '--no-parallel'
      ]);
      return expect(
        runMochaAsync('options/parallel/test-*', ['--parallel']),
        'to be fulfilled with value satisfying',
        {
          passing: expected.passing,
          failing: expected.failing,
          pending: expected.pending,
          code: expected.code
        }
      );
    });
  });

  describe('when used with ESM tests', function () {
    it('should have the same result as with --no-parallel', async function () {
      const expected = getSummary(
        await invokeMochaAsync([
          '--no-parallel',
          resolveFixturePath('esm/*.fixture.mjs')
        ])[1]
      );

      const actual = getSummary(
        await invokeMochaAsync([
          '--parallel',
          resolveFixturePath('esm/*.fixture.mjs')
        ])[1]
      );

      return expect(actual, 'to satisfy', {
        pending: expected.pending,
        passing: expected.passing,
        failing: expected.failing
      });
    });
  });

  describe('when used with --retries', function () {
    it('should retry tests appropriately', async function () {
      return expect(
        runMochaAsync('options/parallel/retries-*', ['--parallel']),
        'when fulfilled',
        'to satisfy',
        expect
          .it('to have failed')
          .and('to have passed test count', 1)
          .and('to have pending test count', 0)
          .and('to have failed test count', 1)
          .and('to contain output', /count: 3/)
      );
    });
  });

  describe('when used with --repeats', function () {
    it('should repeat tests appropriately', async function () {
      return expect(
        runMochaAsync('options/parallel/repeats*', ['--parallel']),
        'when fulfilled',
        'to satisfy',
        expect
          .it('to have failed')
          .and('to have passed test count', 1)
          .and('to have pending test count', 0)
          .and('to have failed test count', 1)
          .and('to contain output', /RUN: 2/)
      );
    });
  });

  describe('when used with --allow-uncaught', function () {
    it('should bubble up an exception', async function () {
      return expect(
        invokeMochaAsync(
          [
            resolveFixturePath('options/parallel/uncaught'),
            '--parallel',
            '--allow-uncaught'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to satisfy',
        expect
          .it('to contain output', /Error: existential isolation/i)
          .and('to have exit code', 1)
      );
    });
  });

  describe('when used with --file', function () {
    it('should error out', async function () {
      return expect(
        invokeMochaAsync(
          [
            '--file',
            resolveFixturePath('options/parallel/test-a'),
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to contain output',
        /mutually exclusive with --file/
      );
    });
  });

  describe('when used with --sort', function () {
    it('should error out', async function () {
      return expect(
        invokeMochaAsync(
          [
            '--sort',
            resolveFixturePath('options/parallel/test-*'),
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to contain output',
        /mutually exclusive with --sort/
      );
    });
  });

  describe('when used with exclusive tests', function () {
    it('should error out', async function () {
      return expect(
        invokeMochaAsync(
          [
            resolveFixturePath('options/parallel/exclusive-test-*'),
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to contain output',
        /`\.only` is not supported in parallel mode/
      );
    });
  });

  describe('when used with --bail', function () {
    it('should skip some tests', async function () {
      const result = await runMochaAsync('options/parallel/test-*', [
        '--parallel',
        '--bail'
      ]);
      // we don't know _exactly_ how many tests will be skipped here
      // due to the --bail, but the number of tests completed should be
      // less than the total, which is 5.
      return expect(
        result.passing + result.pending + result.failing,
        'to be less than',
        5
      );
    });

    it('should fail', async function () {
      return expect(
        runMochaAsync('options/parallel/test-*', ['--parallel', '--bail']),
        'when fulfilled',
        'to have failed'
      );
    });
  });

  describe('when encountering a "bail" in context', function () {
    it('should skip some tests', async function () {
      const result = await runMochaAsync('options/parallel/bail', [
        '--parallel'
      ]);
      return expect(
        result.passing + result.pending + result.failing,
        'to be less than',
        2
      );
    });

    it('should fail', async function () {
      return expect(
        runMochaAsync('options/parallel/bail', ['--parallel', '--bail']),
        'when fulfilled',
        'to have failed'
      );
    });
  });

  describe('when used with "grep"', function () {
    it('should be equivalent to running in serial', async function () {
      const expected = await runMochaAsync('options/parallel/test-*', [
        '--no-parallel',
        '--grep="suite d"'
      ]);
      return expect(
        runMochaAsync('options/parallel/test-*', [
          '--parallel',
          '--grep="suite d"'
        ]),
        'to be fulfilled with value satisfying',
        {
          passing: expected.passing,
          failing: expected.failing,
          pending: expected.pending,
          code: expected.code
        }
      );
    });
  });

  describe('reporter equivalence', function () {
    // each reporter name is duplicated; one is in all lower-case
    // 'base' is abstract, 'html' is browser-only, others are incompatible
    const DENY = ['progress', 'base', 'html', 'markdown', 'json-stream'];
    Object.keys(Mocha.reporters)
      .filter(name => /^[a-z]/.test(name) && DENY.indexOf(name) === -1)
      .forEach(reporter => {
        describe(`when multiple test files run with --reporter=${reporter}`, function () {
          it('should have the same result as when run with --no-parallel', async function () {
            // note that the output may not be in the same order, as running file
            // order is non-deterministic in parallel mode
            const expected = await runMochaAsync('options/parallel/test-*', [
              '--reporter',
              reporter,
              '--no-parallel'
            ]);
            return expect(
              runMochaAsync('options/parallel/test-*', [
                '--reporter',
                reporter,
                '--parallel'
              ]),
              'to be fulfilled with value satisfying',
              {
                passing: expected.passing,
                failing: expected.failing,
                pending: expected.pending,
                code: expected.code
              }
            );
          });
        });
      });

    describe('when a single test file is run with --reporter=dot', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'dot');
      });
    });

    describe('when a single test file is run with --reporter=doc', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'doc');
      });
    });

    describe('when a single test file is run with --reporter=tap', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'tap');
      });
    });

    describe('when a single test file is run with --reporter=list', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'list');
      });
    });

    describe('when a single test file is run with --reporter=min', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'min');
      });
    });

    describe('when a single test file is run with --reporter=spec', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'spec');
      });
    });

    describe('when a single test file is run with --reporter=nyan', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'nyan');
      });
    });

    describe('when a single test file is run with --reporter=landing', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        return assertReporterOutputEquality.call(this, 'landing');
      });
    });

    describe('when a single test file is run with --reporter=progress', function () {
      it('should fail due to incompatibility', async function () {
        return expect(
          invokeMochaAsync(
            [
              resolveFixturePath('options/parallel/test-a'),
              '--reporter=progress',
              '--parallel'
            ],
            'pipe'
          )[1],
          'when fulfilled',
          'to satisfy',
          expect
            .it('to have failed')
            .and('to contain output', /mutually exclusive/)
        );
      });
    });

    describe('when a single test file is run with --reporter=markdown', function () {
      it('should fail due to incompatibility', async function () {
        return expect(
          invokeMochaAsync(
            [
              resolveFixturePath('options/parallel/test-a'),
              '--reporter=markdown',
              '--parallel'
            ],
            'pipe'
          )[1],
          'when fulfilled',
          'to satisfy',
          expect
            .it('to have failed')
            .and('to contain output', /mutually exclusive/)
        );
      });
    });

    describe('when a single test file is run with --reporter=json-stream', function () {
      it('should fail due to incompatibility', async function () {
        return expect(
          invokeMochaAsync(
            [
              resolveFixturePath('options/parallel/test-a'),
              '--reporter=json-stream',
              '--parallel'
            ],
            'pipe'
          )[1],
          'when fulfilled',
          'to satisfy',
          expect
            .it('to have failed')
            .and('to contain output', /mutually exclusive/)
        );
      });
    });

    describe('when a single test file is run with --reporter=json', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        // this one has some timings/durations that we can safely ignore
        const {expected, actual} = await compareReporters('json');
        expected.output = JSON.parse(expected.output);
        actual.output = JSON.parse(actual.output);
        return expect(actual, 'to satisfy', {
          passing: expected.passing,
          failing: expected.failing,
          pending: expected.pending,
          code: expected.code,
          output: {
            stats: {
              suites: expected.output.stats.suites,
              tests: expected.output.stats.tests,
              passes: expected.output.stats.passes,
              pending: expected.output.stats.pending,
              failures: expected.output.stats.failures
            },
            tests: expected.tests
          }
        });
      });
    });

    describe('when a single test file is run with --reporter=xunit', function () {
      it('should have the same output as when run with --no-parallel', async function () {
        // durations need replacing
        const {expected, actual} = await compareReporters('xunit');
        expected.output = expected.output
          .replace(/time=".+?"/g, 'time="0.5"')
          .replace(/timestamp=".+?"/g, 'timestamp="some-timestamp');
        actual.output = actual.output
          .replace(/time=".+?"/g, 'time="0.5"')
          .replace(/timestamp=".+?"/g, 'timestamp="some-timestamp');
        return expect(actual, 'to satisfy', {
          passing: expected.passing,
          failing: expected.failing,
          pending: expected.pending,
          code: expected.code,
          output: expected.output
        });
      });
    });
  });

  describe('pool shutdown', function () {
    // these are unusual and deserve some explanation. we start our mocha
    // subprocess, and in parallel mode, that subprocess spawns more
    // subprocesses. `invokeMochaAsync` returns a tuple of a `mocha`
    // `ChildProcess` object and a `Promise` (which will resolve/reject when the
    // subprocess finishes its test run). we use the `pid` from the `mocha`
    // `ChildProcess` to ask `pidtree` (https://npm.im/pidtree) for the
    // children, which are the worker processes. the `mocha` subprocess does
    // _not_ immediately spawn worker processes, so we need to _poll_ for child
    // processes. when we have them, we record them.  once the `Promise`
    // resolves, we then attempt to get pid information for our `mocha` process
    // and _each_ worker process we retrieved earlier. if a process does not
    // exist, `pidtree` will reject--this is what we _want_ to happen.  we check
    // each explicitly in case the child processes are somehow orphaned.
    //
    // we return `null` for each in the case of the expected rejection--if the
    // `Promise.all()` call results in an array containing anything _except_ a
    // bunch of `null`s, then this test fails, because one of the processes is
    // still running. this behavior is dependent on `workerpool@6.0.2`, which
    // added a guarantee that terminating the pool will _wait_ until all child
    // processes have actually exited.
    describe('during normal operation', function () {
      it('should not leave orphaned processes around', async function () {
        const [{pid}, promise] = invokeMochaAsync([
          resolveFixturePath('options/parallel/test-*'),
          '--parallel'
        ]);
        const childPids = await waitForChildPids(pid);
        await promise;
        return expect(
          Promise.all(
            [pid, ...childPids].map(async childPid => {
              let pids = null;
              try {
                pids = await pidtree(childPid, {root: true});
              } catch (ignored) {}
              return pids;
            })
          ),
          'when fulfilled',
          'to have items satisfying',
          null
        );
      });
    });

    describe('during operation with --bail', function () {
      it('should not leave orphaned processes around', async function () {
        const [{pid}, promise] = invokeMochaAsync([
          resolveFixturePath('options/parallel/test-*'),
          '--bail',
          '--parallel'
        ]);
        const childPids = await waitForChildPids(pid);
        await promise;
        return expect(
          Promise.all(
            [pid, ...childPids].map(async childPid => {
              let pids = null;
              try {
                pids = await pidtree(childPid, {root: true});
              } catch (ignored) {}
              return pids;
            })
          ),
          'when fulfilled',
          'to have items satisfying',
          null
        );
      });
    });
  });
});
