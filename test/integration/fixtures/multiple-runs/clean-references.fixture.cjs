'use strict';
const { Mocha } = require('../../../../lib/mocha.js');

const mocha = new Mocha({ reporter: 'json' });
mocha.cleanReferencesAfterRun(true);
require('./run-thrice-helper.cjs')(mocha);
