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

/*
 * Why do we not export Mocha.* directory, but rather pass throug proxy functions?
 * Because Mocha.* is changed on each creation of a new Mocha instance,
 * and the static Mocha.* is set before running a test suite, and so we
 * changes on each new Mocha instance. Usually this is not a problem, as there is only
 * one Mocha instance. Except in the instance of parallel execution, where a worker is
 * reused to run another test file, and so creates another Mocha instance.
 *
 */

// functions used by BDD tests
export const describe = (...args) => Mocha.describe(...args);
describe.only = (...args) => Mocha.describe.only(...args);
describe.skip = (...args) => Mocha.describe.skip(...args);
export const context = (...args) => Mocha.describe(...args);
context.only = (...args) => Mocha.describe.only(...args);
context.skip = (...args) => Mocha.describe.skip(...args);
export const it = (...args) => Mocha.it(...args);
it.only = (...args) => Mocha.it.only(...args);
it.skip = (...args) => Mocha.it.skip(...args);
export const specify = (...args) => Mocha.it(...args);
specify.only = (...args) => Mocha.it.only(...args);
specify.skip = (...args) => Mocha.it.skip(...args);
export const xit = (...args) => Mocha.xit(...args);
export const before = (...args) => Mocha.before(...args); // also used by QUNIT tests
export const after = (...args) => Mocha.after(...args); // also used by QUNIT tests
export const beforeEach = (...args) => Mocha.beforeEach(...args); // also used by QUNIT tests
export const afterEach = (...args) => Mocha.afterEach(...args); // also used by QUNIT tests

// functions used by TDD tests
export const suite = (...args) => Mocha.suite(...args); // also used by QUNIT tests
suite.only = (...args) => Mocha.suite.only(...args);
suite.skip = (...args) => Mocha.suite.skip(...args);
export const test = (...args) => Mocha.test(...args); // also used by QUNIT tests
test.only = (...args) => Mocha.it.only(...args);
test.skip = (...args) => Mocha.it.skip(...args);
export const suiteSetup = (...args) => Mocha.suiteSetup(...args);
export const suiteTeardown = (...args) => Mocha.suiteTeardown(...args);
export const setup = (...args) => Mocha.setup(...args);
export const teardown = (...args) => Mocha.teardown(...args);
