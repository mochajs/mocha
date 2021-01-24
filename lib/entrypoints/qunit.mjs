import Mocha from '../../index.js';

export const suite = (...args) => Mocha.suite(...args);
suite.only = (...args) => Mocha.suite.only(...args);
suite.skip = (...args) => Mocha.suite.skip(...args);
export const test = (...args) => Mocha.test(...args);
test.only = (...args) => Mocha.it.only(...args);
test.skip = (...args) => Mocha.it.skip(...args);
export const before = (...args) => Mocha.before(...args);
export const after = (...args) => Mocha.after(...args);
export const beforeEach = (...args) => Mocha.beforeEach(...args);
export const afterEach = (...args) => Mocha.afterEach(...args);
