'use strict';
const Mocha = require('../../index.js');

exports.suite = (...args) => Mocha.suite(...args);
exports.suite.only = (...args) => Mocha.suite.only(...args);
exports.suite.skip = (...args) => Mocha.suite.skip(...args);
exports.test = (...args) => Mocha.test(...args);
exports.test.only = (...args) => Mocha.test.only(...args);
exports.test.skip = (...args) => Mocha.test.skip(...args);
exports.before = (...args) => Mocha.before(...args);
exports.after = (...args) => Mocha.after(...args);
exports.beforeEach = (...args) => Mocha.beforeEach(...args);
exports.afterEach = (...args) => Mocha.afterEach(...args);
