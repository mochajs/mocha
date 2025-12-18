// this built file is not committed to the repo
/* eslint-disable-next-line n/no-missing-import */
import "./mocha.js";

const {mocha, Mocha} = globalThis;

const mochaExports = {
  afterEach: (...args) => globalThis.afterEach?.(...args),
  after: (...args) => globalThis.after?.(...args),
  beforeEach: (...args) => globalThis.beforeEach?.(...args),
  before: (...args) => globalThis.before?.(...args),
  describe: (...args) => globalThis.describe?.(...args),
  it: (...args) => globalThis.it?.(...args),
  xdescribe: (...args) => globalThis.xdescribe?.(...args),
  xit: (...args) => globalThis.xit?.(...args),
  setup: (...args) => mocha.setup?.(...args),
  suiteSetup: (...args) => globalThis.suiteSetup?.(...args),
  suiteTeardown: (...args) => globalThis.suiteTeardown?.(...args),
  suite: (...args) => globalThis.suite?.(...args),
  teardown: (...args) => globalThis.teardown?.(...args),
  test: (...args) => globalThis.test?.(...args),
  xspecify: (...args) => globalThis.xspecify?.(...args),
  specify: (...args) => globalThis.specify?.(...args),
  context: (...args) => globalThis.context?.(...args),
  xcontext: (...args) => globalThis.xcontext?.(...args),
  run: mocha.run.bind(mocha)
};

export default Mocha;

// Export the mocha instance (in browser, this has setup/run methods)
export { mocha };

// Re-export class/utility exports from the Mocha module
export const {
  utils,
  interfaces,
  reporters,
  Runnable,
  Context,
  Runner,
  Suite,
  Hook,
  Test,
} = Mocha;

// Re-export test interface functions
export const {
  after,
  afterEach,
  before,
  beforeEach,
  context,
  describe,
  it,
  run,
  setup,
  suiteSetup,
  suiteTeardown,
  suite,
  teardown,
  test,
  specify,
  xcontext,
  xdescribe,
  xit,
  xspecify,
} = mochaExports;
