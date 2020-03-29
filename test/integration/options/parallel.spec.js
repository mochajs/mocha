'use strict';
var Mocha = require('../../../lib/mocha');
var path = require('path');
var helpers = require('../helpers');
var runMochaAsync = helpers.runMochaAsync;
var invokeMochaAsync = helpers.invokeMochaAsync;

describe('--parallel', function() {
  describe('when used with CJS tests', function() {
    it('should have the same result as with --no-parallel', function() {
      this.timeout(5000);
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
    it('should have the same result as with --no-parallel', function() {
      this.timeout(5000);
      return runMochaAsync(
        path.join(__dirname, '..', 'fixtures', 'esm', '*.fixture.mjs'),
        ['--no-parallel']
      ).then(function(expected) {
        return expect(
          runMochaAsync(
            path.join(__dirname, '..', 'fixtures', 'esm', '*.fixture.mjs'),
            ['--parallel']
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

  // each reporter name is duplicated; one is in all lower-case
  Object.keys(Mocha.reporters)
    .filter(function(name) {
      return /^[a-z]/.test(name);
    })
    .forEach(function(reporter) {
      describe('when used with --reporter=' + reporter, function() {
        it('should have the same result as run with --no-parallel', function() {
          this.timeout(5000);
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
      });
    });
});
