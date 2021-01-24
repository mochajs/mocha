import Mocha from '../../index.js';

export const describe = (...args) => Mocha.describe(...args);
describe.only = (...args) => Mocha.describe.only(...args);
describe.skip = (...args) => Mocha.describe.skip(...args);
export const context = (...args) => Mocha.describe(...args);
export const it = (...args) => Mocha.it(...args);
it.only = (...args) => Mocha.it.only(...args);
it.skip = (...args) => Mocha.it.skip(...args);
export const specify = (...args) => Mocha.it(...args);
specify.only = (...args) => Mocha.it.only(...args);
specify.skip = (...args) => Mocha.it.skip(...args);
export const xit = (...args) => Mocha.xit(...args);
export const before = (...args) => Mocha.before(...args);
export const after = (...args) => Mocha.after(...args);
export const beforeEach = (...args) => Mocha.beforeEach(...args);
export const afterEach = (...args) => Mocha.afterEach(...args);
