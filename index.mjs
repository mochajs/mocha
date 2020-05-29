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
