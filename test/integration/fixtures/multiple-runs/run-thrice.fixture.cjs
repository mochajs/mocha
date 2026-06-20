'use strict';
const Mocha = require('../../../../lib/mocha.cjs');

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(false);
require('./run-thrice-helper.cjs')(mocha);
