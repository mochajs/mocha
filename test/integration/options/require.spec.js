'use strict';

var invokeMochaAsync = require('../helpers').invokeMochaAsync;

describe('--require', function() {
  it('should allow registration of root hooks', function() {
    return expect(
      invokeMochaAsync([
        '--require',
        require.resolve(
          '../fixtures/options/require/root-hook-defs-a.fixture.js'
        ),
        '--require',
        require.resolve(
          '../fixtures/options/require/root-hook-defs-b.fixture.js'
        ),
        require.resolve('../fixtures/options/require/root-hook-test.fixture.js')
      ])[1],
      'when fulfilled',
      'to have succeeded'
    );
  });
});
