import Mocha from '../../index.js';

export default Mocha;

// API stuff
export const utils = Mocha.utils;
export const interfaces = Mocha.interfaces;
export const reporters = Mocha.reporters;
export const Runnable = Mocha.Runnable;
export const Context = Mocha.Context;
export const Runner = Mocha.Runner;
export const Suite = Mocha.Suite;
export const Hook = Mocha.Hook;
export const Test = Mocha.Test;
export const unloadFile = Mocha.unloadFile;

// functions used by BDD tests
export const describe = Mocha.describe;
export const context = Mocha.describe;
export const it = Mocha.it;
export const specify = Mocha.it;
export const xit = Mocha.xit;
export const before = Mocha.before; // also used by QUNIT tests
export const after = Mocha.after; // also used by QUNIT tests
export const beforeEach = Mocha.beforeEach; // also used by QUNIT tests
export const afterEach = Mocha.afterEach; // also used by QUNIT tests

// functions used by TDD tests
export const suite = Mocha.suite; // also used by QUNIT tests
export const test = Mocha.test; // also used by QUNIT tests
export const suiteSetup = Mocha.suiteSetup;
export const suiteTeardown = Mocha.suiteTeardown;
export const setup = Mocha.setup;
export const teardown = Mocha.teardown;
