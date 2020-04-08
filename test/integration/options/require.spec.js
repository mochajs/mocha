'use strict';

var invokeMochaAsync = require('../helpers').invokeMochaAsync;

describe('--require', function() {
  describe('when run in serial', function() {
    it('should allow registration of root hooks', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-b.fixture.js'
            ),
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll\nbeforeAll array 1\nbeforeAll array 2\nbeforeEach\nbeforeEach array 1\nbeforeEach array 2\n/
      ).and(
        'when fulfilled',
        'to contain output',
        /afterEach\nafterEach array 1\nafterEach array 2\nafterAll\nafterAll array 1\nafterAll array 2\n/
      );
    });
  });

  describe('when run with --parallel', function() {
    it('should allow registration of root hooks', function() {
      return expect(
        invokeMochaAsync([
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-a.fixture.js'
            ),
          '--require=' +
            require.resolve(
              '../fixtures/options/require/root-hook-defs-b.fixture.js'
            ),
          '--parallel',
          require.resolve(
            '../fixtures/options/require/root-hook-test.fixture.js'
          )
        ])[1],
        'when fulfilled',
        'to contain output',
        /beforeAll\nbeforeAll array 1\nbeforeAll array 2\nbeforeEach\nbeforeEach array 1\nbeforeEach array 2\n/
      ).and(
        'when fulfilled',
        'to contain output',
        /afterEach\nafterEach array 1\nafterEach array 2\nafterAll\nafterAll array 1\nafterAll array 2\n/
      );
    });
  });
});
