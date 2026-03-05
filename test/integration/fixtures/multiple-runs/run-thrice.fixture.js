
import { mocha } from '../../../../lib/mocha.js';

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(false);
require('./run-thrice-helper')(mocha);
