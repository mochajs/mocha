'use strict';
const { Mocha } = require('../../../../lib/mocha.js');

const mocha = new Mocha({ reporter: 'json' });
mocha.dispose();
require('./run-thrice-helper.cjs')(mocha);
