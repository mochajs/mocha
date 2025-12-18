// this built file is not committed to the repo
/* eslint-disable-next-line n/no-missing-import */
import "./mocha.js";

const { mocha } = globalThis;

mocha.ui();

const after = globalThis.after.bind(mocha);
const afterEach = globalThis.afterEach.bind(mocha);
const before = globalThis.before.bind(mocha);
const beforeEach = globalThis.beforeEach.bind(mocha);
const context = globalThis.context.bind(mocha);
const describe = globalThis.describe.bind(mocha);
const it = globalThis.it.bind(mocha);
const specify = globalThis.specify.bind(mocha);
const xcontext = globalThis.xcontext.bind(mocha);
const xdescribe = globalThis.xdescribe.bind(mocha);
const xit = globalThis.xit.bind(mocha);
const xspecify = globalThis.xspecify.bind(mocha);

const run = mocha.run.bind(mocha);
const setup = mocha.setup.bind(mocha);

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
