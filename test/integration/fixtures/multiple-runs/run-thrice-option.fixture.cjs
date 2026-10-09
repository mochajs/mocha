'use strict';
const Mocha = require('../../../../lib/mocha.cjs');

const mocha = new Mocha({ reporter: 'json', cleanReferencesAfterRun: false });
require('./run-thrice-helper.cjs')(mocha);
