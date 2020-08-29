'use strict';

var Mocha = require('../../lib/mocha');

describe('diffs', function() {
  it('test', async () => {
    const mocha = new Mocha();
    mocha.addFile('./test/integration/fixtures/simple.fixture.js');
    const result = mocha.run();
    const resultTests = await result.result;
    const successTests = resultTests.filter(test => test.state === 'passed');
    const failedTests = resultTests.filter(test => test.state === 'failed');
    console.log('successTests', successTests.length);
    console.log('failedTests', failedTests.length);
  });
});
