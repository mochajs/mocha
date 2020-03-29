'use strict';

var path = require('path');
var helpers = require('../helpers');
var runMochaAsync = helpers.runMochaAsync;
var invokeMochaAsync = helpers.invokeMochaAsync;

describe('--parallel', function() {
  it('should not appear fundamentally different than without', function() {
    return expect(
      runMochaAsync(path.join('options', 'parallel', 'test-*.fixture.js'), [
        '--parallel'
      ]),
      'when fulfilled',
      'to have failed'
    )
      .and('when fulfilled', 'to have passed test count', 2)
      .and('when fulfilled', 'to have pending test count', 1)
      .and('when fulfilled', 'to have failed test count', 2);
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
});
