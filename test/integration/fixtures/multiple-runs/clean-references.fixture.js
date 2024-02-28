'use strict';
const Mocha = require('../../../../lib/mocha');

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(true);
require('./run-thrice-helper')(mocha);
