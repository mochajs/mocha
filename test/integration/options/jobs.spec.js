'use strict';

var helpers = require('../helpers');
var runMochaAsync = helpers.runMochaAsync;

describe('--jobs', function() {
  describe('when set to a number less than 2', function() {
    it('should run tests in serial', function() {
      return expect(
        runMochaAsync(
          'options/jobs/fail-in-parallel',
          ['--parallel', '--jobs', '1'],
          'pipe'
        ),
        'when fulfilled',
        'to have passed'
      );
    });
  });

  describe('when set to a number greater than 1', function() {
    it('should run tests in parallel', function() {
      return expect(
        runMochaAsync(
          'options/jobs/fail-in-parallel',
          ['--parallel', '--jobs', '2'],
          'pipe'
        ),
        'when fulfilled',
        'to have failed'
      );
    });
  });
});
