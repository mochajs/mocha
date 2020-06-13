'use strict';
const Mocha = require('../../index.js');

exports.describe = Mocha.describe;
exports.context = Mocha.describe;
exports.it = Mocha.it;
exports.specify = Mocha.it;
exports.xit = Mocha.xit;
exports.before = Mocha.before;
exports.after = Mocha.after;
exports.beforeEach = Mocha.beforeEach;
exports.afterEach = Mocha.afterEach;
