'use strict';

var Mocha = require('../../lib/mocha');

describe('diffs', function() {
  it.skip('test', async () => {
    const mocha = new Mocha();
    mocha.addFile('./test/integration/fixtures/simple.fixture.js');
    const result = await mocha.runAsync();
    const successTests = result.filter(test => test.state === 'passed');
    const failedTests = result.filter(test => test.state === 'failed');
    expect(successTests, 'to have length', 5);
    expect(failedTests, 'to have length', 2);
  });
});
