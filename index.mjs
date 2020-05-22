import Mocha from './index.js';

export default Mocha;

export const before = Mocha.before;
export const after = Mocha.after;
export const beforeEach = Mocha.beforeEach;
export const afterEach = Mocha.afterEach;
export const describe = Mocha.describe;
export const suite = Mocha.suite;
export const suiteSetup = Mocha.suiteSetup;
export const suiteTeardown = Mocha.suiteTeardown;
export const it = Mocha.it;
export const xit = Mocha.xit;
export const test = Mocha.test;
export const run = Mocha.run;
