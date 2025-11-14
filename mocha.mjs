/* eslint-disable-next-line n/no-missing-import */
import "./mocha.js";

const { mocha } = globalThis;
const after = mocha.after.bind(mocha);
const afterEach = mocha.afterEach.bind(mocha);
const before = mocha.before.bind(mocha);
const beforeEach = mocha.beforeEach.bind(mocha);
const context = mocha.context.bind(mocha);
const describe = mocha.describe.bind(mocha);
const it = mocha.it.bind(mocha);
const run = mocha.run.bind(mocha);
const setup = mocha.setup.bind(mocha);
const specify = mocha.specify.bind(mocha);
const xcontext = mocha.xcontext.bind(mocha);
const xdescribe = mocha.xdescribe.bind(mocha);
const xit = mocha.xit.bind(mocha);
const xspecify = mocha.xspecify.bind(mocha);

export {
  after,
  afterEach,
  before,
  beforeEach,
  context,
  describe,
  it,
  run,
  setup,
  specify,
  xcontext,
  xdescribe,
  xit,
  xspecify,
};
