
import { mocha } from '../../../../lib/mocha.js';

const mocha = new Mocha({ reporter: 'json' });
mocha.addFile(require.resolve('./start-second-run-if-previous-is-still-running-suite.fixture.js'));
mocha.run();
try {
  mocha.run();
} catch (err) {
  console.error(err.code);
}

