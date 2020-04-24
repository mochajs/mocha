'use strict';
const Mocha = require('../../../../lib/mocha');

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(false);
require('./run-thrice-helper')(mocha);
