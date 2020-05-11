'use strict';
const Mocha = require('../../../../lib/mocha');

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(false);
mocha.addFile(require.resolve('./multiple-runs-with-flaky-before-each-suite.fixture.js'));
console.log('[');
mocha.run(() => {
  console.log(',');
  mocha.run(() => {
    console.log(']');
  });
});
