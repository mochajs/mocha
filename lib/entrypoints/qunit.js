'use strict';
const Mocha = require('../../index.js');

exports.before = Mocha.before;
exports.after = Mocha.after;
exports.beforeEach = Mocha.beforeEach;
exports.afterEach = Mocha.afterEach;
exports.suite = Mocha.suite;
exports.test = Mocha.test;
