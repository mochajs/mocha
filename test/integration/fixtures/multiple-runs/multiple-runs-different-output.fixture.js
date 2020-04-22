'use strict';
const Mocha = require('../../../../lib/mocha');

const mocha = new Mocha({ reporter: 'json' });
if (process.argv.indexOf('--no-clean-references') >= 0) {
  mocha.cleanReferencesAfterRun(false);
}
if (process.argv.indexOf('--directly-dispose') >= 0) {
  mocha.dispose();
}
mocha.addFile(require.resolve('./multiple-runs-different-output-suite.fixture.js'));
console.log('[');
try {
  mocha.run(() => {
    console.log(',');
    try {
      mocha.run(() => {
        console.log(',');
        mocha.run(() => {
          console.log(']');
        });
      });
    } catch (err) {
      console.error(err.code);
      throw err;
    }
  });
} catch (err) {
  console.error(err.code);
  throw err;
}
