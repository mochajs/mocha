import "./mocha.js"

const { mocha } = globalThis;

const describe = mocha.describe.bind(mocha);
const context = mocha.context.bind(mocha);
const it = mocha.it.bind(mocha);
const specify = mocha.specify.bind(mocha);
const xdescribe = mocha.xdescribe.bind(mocha);
const xcontext = mocha.xcontext.bind(mocha);
const xit = mocha.xit.bind(mocha);
const xspecify = mocha.xspecify.bind(mocha);
const before = mocha.before.bind(mocha);
const beforeEach = mocha.beforeEach.bind(mocha);
const afterEach = mocha.afterEach.bind(mocha);
const after = mocha.after.bind(mocha);

const setup = mocha.setup.bind(mocha);
const run = mocha.run.bind(mocha);

export {
  describe, context, it, specify, xdescribe, xcontext,
  xit, xspecify, before, beforeEach, afterEach, after, setup, run
};
