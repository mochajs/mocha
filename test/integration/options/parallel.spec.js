'use strict';
var Mocha = require('../../../lib/mocha');
var path = require('path');
var helpers = require('../helpers');
var runMochaAsync = helpers.runMochaAsync;
var invokeMochaAsync = helpers.invokeMochaAsync;
var getSummary = helpers.getSummary;
var utils = require('../../../lib/utils');

function compareReporters(reporter) {
  return runMochaAsync(path.join('options', 'parallel', 'test-a.fixture.js'), [
    '--reporter',
    reporter,
    '--no-parallel'
  ]).then(function(expected) {
    expected.output = expected.output.replace(/\d+m?s/g, '100ms');
    return runMochaAsync(
      path.join('options', 'parallel', 'test-a.fixture.js'),
      ['--reporter', reporter, '--parallel']
    ).then(function(actual) {
      actual.output = actual.output.replace(/\d+m?s/g, '100ms');
      return [actual, expected];
    });
  });
}

function runGenericReporterTest(reporter) {
  return compareReporters.call(this, reporter).then(function(result) {
    var expected = result.shift();
    var actual = result.shift();
    return expect(actual, 'to satisfy', {
      passing: expected.passing,
      failing: expected.failing,
      pending: expected.pending,
      code: expected.code,
      output: expected.output
    });
  });
}

describe('--parallel', function() {
  describe('when a test has a syntax error', function() {
    describe('when there is only a single test file', function() {
      it('should fail gracefully', function() {
        return expect(
          runMochaAsync('options/parallel/syntax-err', ['--parallel']),
          'when fulfilled',
          'to have failed with output',
          /SyntaxError/
        );
      });
    });

    describe('when there are multiple test files', function() {
      it('should fail gracefully', function() {
        return expect(
          invokeMochaAsync(
            [
              require.resolve(
                '../fixtures/options/parallel/syntax-err.fixture.js'
              ),
              '--parallel'
            ],
            'pipe'
          )[1],
          'when fulfilled',
          'to have failed'
        );
      });
    });
  });

  describe('when used with CJS tests', function() {
    it('should have the same result as with --no-parallel', function() {
      return runMochaAsync(
        path.join('options', 'parallel', 'test-*.fixture.js'),
        ['--no-parallel']
      ).then(function(expected) {
        return expect(
          runMochaAsync(path.join('options', 'parallel', 'test-*.fixture.js'), [
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

  describe('when used with ESM tests', function() {
    var esmArgs =
      Number(process.versions.node.split('.')[0]) >= 13
        ? []
        : ['--experimental-modules'];

    before(function() {
      if (!utils.supportsEsModules()) this.skip();
    });

    it('should have the same result as with --no-parallel', function() {
      var glob = path.join(__dirname, '..', 'fixtures', 'esm', '*.fixture.mjs');
      return invokeMochaAsync(esmArgs.concat('--no-parallel', glob))[1].then(
        function(expected) {
          expected = getSummary(expected);
          return invokeMochaAsync(esmArgs.concat('--parallel', glob))[1].then(
            function(actual) {
              actual = getSummary(actual);
              expect(actual, 'to satisfy', {
                pending: expected.pending,
                passing: expected.passing,
                failing: expected.failing
              });
            }
          );
        }
      );
    });
  });

  describe('when used with --retries', function() {
    it('should retry tests appropriately', function() {
      return expect(
        runMochaAsync(
          path.join('options', 'parallel', 'retries-*.fixture.js'),
          ['--parallel']
        ),
        'when fulfilled',
        'to have failed'
      )
        .and('when fulfilled', 'to have passed test count', 1)
        .and('when fulfilled', 'to have pending test count', 0)
        .and('when fulfilled', 'to have failed test count', 1)
        .and('when fulfilled', 'to contain output', /count: 3/);
    });
  });

  describe('when used with --allow-uncaught', function() {
    it('should bubble up an exception', function() {
      return expect(
        invokeMochaAsync(
          [
            require.resolve('../fixtures/options/parallel/uncaught.fixture.js'),
            '--parallel',
            '--allow-uncaught'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to contain output',
        /Error: existential isolation/i
      ).and('when fulfilled', 'to have exit code', 1);
    });
  });

  describe('when used with --file', function() {
    it('should error out', function() {
      return expect(
        invokeMochaAsync(
          [
            '--file',
            path.join('options', 'parallel', 'test-a.fixture.js'),
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

  describe('when used with --sort', function() {
    it('should error out', function() {
      return expect(
        invokeMochaAsync(
          [
            '--sort',
            path.join(
              __dirname,
              '..',
              'fixtures',
              'options',
              'parallel',
              'test-*.fixture.js'
            ),
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

  describe('when used with exclusive tests', function() {
    it('should error out', function() {
      return expect(
        invokeMochaAsync(
          [
            path.join(
              __dirname,
              '..',
              'fixtures',
              'options',
              'parallel',
              'exclusive-test-*.fixture.js'
            ),
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

  describe('when used with --bail', function() {
    it('should skip some tests', function() {
      return runMochaAsync(
        path.join('options', 'parallel', 'test-*.fixture.js'),
        ['--parallel', '--bail']
      ).then(function(result) {
        // we don't know _exactly_ how many tests will be skipped here
        // due to the --bail, but the number of tests completed should be
        // less than the total, which is 5.
        return expect(
          result.passing + result.pending + result.failing,
          'to be less than',
          5
        );
      });
    });

    it('should fail', function() {
      return expect(
        runMochaAsync(path.join('options', 'parallel', 'test-*.fixture.js'), [
          '--parallel',
          '--bail'
        ]),
        'when fulfilled',
        'to have failed'
      );
    });
  });

  describe('when encountering a "bail" in context', function() {
    it('should skip some tests', function() {
      return runMochaAsync('options/parallel/bail', ['--parallel']).then(
        function(result) {
          return expect(
            result.passing + result.pending + result.failing,
            'to be less than',
            2
          );
        }
      );
    });

    it('should fail', function() {
      return expect(
        runMochaAsync('options/parallel/bail', ['--parallel', '--bail']),
        'when fulfilled',
        'to have failed'
      );
    });
  });

  describe('when used with "grep"', function() {
    it('should be equivalent to running in serial', function() {
      return runMochaAsync(
        path.join('options', 'parallel', 'test-*.fixture.js'),
        ['--no-parallel', '--grep="suite d"']
      ).then(function(expected) {
        return expect(
          runMochaAsync(path.join('options', 'parallel', 'test-*.fixture.js'), [
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
  });

  describe('reporter equivalence', function() {
    // each reporter name is duplicated; one is in all lower-case
    // 'base' is abstract, 'html' is browser-only, others are incompatible
    var DENY = ['progress', 'base', 'html', 'markdown', 'json-stream'];
    Object.keys(Mocha.reporters)
      .filter(function(name) {
        return /^[a-z]/.test(name) && DENY.indexOf(name) === -1;
      })
      .forEach(function(reporter) {
        describe(
          'when multiple test files run with --reporter=' + reporter,
          function() {
            it('should have the same result as when run with --no-parallel', function() {
              // note that the output may not be in the same order, as running file
              // order is non-deterministic in parallel mode
              return runMochaAsync(
                path.join('options', 'parallel', 'test-*.fixture.js'),
                ['--reporter', reporter, '--no-parallel']
              ).then(function(expected) {
                return expect(
                  runMochaAsync(
                    path.join('options', 'parallel', 'test-*.fixture.js'),
                    ['--reporter', reporter, '--parallel']
                  ),
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
          }
        );
      });
  });

  describe('when a single test file is run with --reporter=dot', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'dot');
    });
  });

  describe('when a single test file is run with --reporter=doc', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'doc');
    });
  });

  describe('when a single test file is run with --reporter=tap', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'tap');
    });
  });

  describe('when a single test file is run with --reporter=list', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'list');
    });
  });

  describe('when a single test file is run with --reporter=min', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'min');
    });
  });

  describe('when a single test file is run with --reporter=spec', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'spec');
    });
  });

  describe('when a single test file is run with --reporter=nyan', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'nyan');
    });
  });

  describe('when a single test file is run with --reporter=landing', function() {
    it('should have the same output as when run with --no-parallel', function() {
      return runGenericReporterTest.call(this, 'landing');
    });
  });

  describe('when a single test file is run with --reporter=progress', function() {
    it('should fail due to incompatibility', function() {
      return expect(
        invokeMochaAsync(
          [
            require.resolve('../fixtures/options/parallel/test-a.fixture.js'),
            '--reporter=progress',
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to have failed'
      ).and('when fulfilled', 'to contain output', /mutually exclusive/);
    });
  });

  describe('when a single test file is run with --reporter=markdown', function() {
    it('should fail due to incompatibility', function() {
      return expect(
        invokeMochaAsync(
          [
            require.resolve('../fixtures/options/parallel/test-a.fixture.js'),
            '--reporter=markdown',
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to have failed'
      ).and('when fulfilled', 'to contain output', /mutually exclusive/);
    });
  });

  describe('when a single test file is run with --reporter=json-stream', function() {
    it('should fail due to incompatibility', function() {
      return expect(
        invokeMochaAsync(
          [
            require.resolve('../fixtures/options/parallel/test-a.fixture.js'),
            '--reporter=json-stream',
            '--parallel'
          ],
          'pipe'
        )[1],
        'when fulfilled',
        'to have failed'
      ).and('when fulfilled', 'to contain output', /mutually exclusive/);
    });
  });

  describe('when a single test file is run with --reporter=json', function() {
    it('should have the same output as when run with --no-parallel', function() {
      // this one has some timings/durations that we can safely ignore
      return compareReporters.call(this, 'json').then(function(result) {
        var expected = result.shift();
        expected.output = JSON.parse(expected.output);
        var actual = result.shift();
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
  });

  describe('when a single test file is run with --reporter=xunit', function() {
    it('should have the same output as when run with --no-parallel', function() {
      // durations need replacing
      return compareReporters.call(this, 'xunit').then(function(result) {
        var expected = result.shift();
        expected.output = expected.output
          .replace(/time=".+?"/g, 'time="0.5"')
          .replace(/timestamp=".+?"/g, 'timestamp="some-timestamp');
        var actual = result.shift();
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
});
