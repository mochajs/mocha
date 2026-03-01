
import { mocha } from '../../../../lib/mocha.js';

const mocha = new Mocha({ reporter: 'json' });
mocha.dispose();
require('./run-thrice-helper')(mocha);
