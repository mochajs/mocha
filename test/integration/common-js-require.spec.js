'use strict';

const {runMochaAsync} = require('./helpers');

describe('common js require', () => {
  it('should be able to run a test where all mocha exports are used', async () => {
    const result = await runMochaAsync('common-js-require.fixture.js', [
      '--delay'
    ]);
    expect(result.output, 'to contain', 'running before');
    expect(result.output, 'to contain', 'running suiteSetup');
    expect(result.output, 'to contain', 'running setup');
    expect(result.output, 'to contain', 'running beforeEach');
    expect(result.output, 'to contain', 'running it');
    expect(result.output, 'to contain', 'running afterEach');
    expect(result.output, 'to contain', 'running teardown');
    expect(result.output, 'to contain', 'running suiteTeardown');
    expect(result.output, 'to contain', 'running after');
  });
});
