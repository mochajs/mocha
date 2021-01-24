import Mocha from '../../index.js';

export const suite = (...args) => Mocha.suite(...args);
suite.only = (...args) => Mocha.suite.only(...args);
suite.skip = (...args) => Mocha.suite.skip(...args);
export const test = (...args) => Mocha.test(...args);
test.only = (...args) => Mocha.it.only(...args);
test.skip = (...args) => Mocha.it.skip(...args);
export const suiteSetup = (...args) => Mocha.suiteSetup(...args);
export const suiteTeardown = (...args) => Mocha.suiteTeardown(...args);
export const setup = (...args) => Mocha.setup(...args);
export const teardown = (...args) => Mocha.teardown(...args);
