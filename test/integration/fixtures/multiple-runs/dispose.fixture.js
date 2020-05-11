'use strict';
const Mocha = require('../../../../lib/mocha');

const mocha = new Mocha({ reporter: 'json' });
mocha.dispose();
require('./run-thrice-helper')(mocha);
