// this built file is not committed to the repo
/* eslint-disable-next-line n/no-missing-import */
import "./mocha.js";

const {mocha, Mocha} = globalThis;

const mochaExports = {
  after: (...args) => globalThis.after?.(...args),
  afterEach: (...args) => globalThis.afterEach?.(...args),
  before: (...args) => globalThis.before?.(...args),
  beforeEach: (...args) => globalThis.beforeEach?.(...args),
  context: (...args) => globalThis.context?.(...args),
  describe: (...args) => globalThis.describe?.(...args),
  it: (...args) => globalThis.it?.(...args),
  run: mocha.run.bind(mocha),
  setup: (...args) => mocha.setup?.(...args),
  suite: (...args) => globalThis.suite?.(...args),
  suiteSetup: (...args) => globalThis.suiteSetup?.(...args),
  suiteTeardown: (...args) => globalThis.suiteTeardown?.(...args),
  teardown: (...args) => globalThis.teardown?.(...args),
  test: (...args) => globalThis.test?.(...args),
  specify: (...args) => globalThis.specify?.(...args),
  xcontext: (...args) => globalThis.xcontext?.(...args),
  xdescribe: (...args) => globalThis.xdescribe?.(...args),
  xit: (...args) => globalThis.xit?.(...args),
  xspecify: (...args) => globalThis.xspecify?.(...args),
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
  suite,
  suiteSetup,
  suiteTeardown,
  teardown,
  test,
  specify,
  xcontext,
  xdescribe,
  xit,
  xspecify,
} = mochaExports;
