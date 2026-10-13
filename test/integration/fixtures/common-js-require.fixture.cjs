const assert = require("node:assert");
const {
  afterEach,
  after,
  beforeEach,
  before,
  context,
  xcontext,
  describe,
  xdescribe,
  it,
  specify,
  xit,
  xspecify,
  setup,
  suiteSetup,
  suiteTeardown,
  suite,
  teardown,
  test,
  run,
} = require("../../..");

assert.strictEqual(context, describe);
assert.strictEqual(context.only, describe.only);
assert.strictEqual(context.skip, describe.skip);
assert.strictEqual(xcontext, xdescribe);
assert.strictEqual(specify, it);
assert.strictEqual(specify.only, it.only);
assert.strictEqual(specify.skip, it.skip);
assert.strictEqual(xspecify, xit);
assert.strictEqual(suite, describe);
assert.strictEqual(suite.only, describe.only);
assert.strictEqual(suite.skip, describe.skip);
assert.strictEqual(test, it);
assert.strictEqual(test.only, it.only);
assert.strictEqual(test.skip, it.skip);
assert.strictEqual(setup, beforeEach);
assert.strictEqual(suiteSetup, before);
assert.strictEqual(suiteTeardown, after);
assert.strictEqual(teardown, afterEach);

suite("root suite", () => {
  setup(() => {
    console.log("running setup");
  });
  before(() => {
    console.log("running before");
  });
  beforeEach(() => {
    console.log("running beforeEach");
  });
  afterEach(() => {
    console.log("running afterEach");
  });
  after(() => {
    console.log("running after");
  });
  teardown(() => {
    console.log("running teardown");
  });
  suiteSetup(() => {
    console.log("running suiteSetup");
  });
  suiteTeardown(() => {
    console.log("running suiteTeardown");
  });

  describe.only("describe.only", () => {
    it("it", () => {
      console.log("running it");
    }).timeout(1000);

    specify("specify", () => {
      console.log("running specify");
    });

    test("test", () => {
      console.log("running test");
    });

    xit("xit", () => {
      console.log("running xit");
    });

    xspecify("xspecify", () => {
      console.log("running xspecify");
    });

    it.only("it.only", () => {
      console.log("running it.only");
    }).retries(2);

    specify.only("specify.only", () => {
      console.log("running specify.only");
    });

    test.only("test.only", () => {
      console.log("running test.only");
    });

    it.skip("it.skip", () => {
      console.log("running it.skip");
    });

    specify.skip("specify.skip", () => {
      console.log("running specify.skip");
    });

    test.skip("test.skip", () => {
      console.log("running test.skip");
    });
  });

  context.only("context.only", () => {
    it("runs context.only", () => {
      console.log("running context.only");
    });
  });

  suite.only("suite.only", () => {
    test("runs suite.only", () => {
      console.log("running suite.only");
    });
  });

  describe("describe", () => {});
  context("context", () => {});
  xdescribe("xdescribe", () => {});
  xcontext("xcontext", () => {});
  describe.skip("describe.skip", () => {});
  context.skip("context.skip", () => {});
  suite.skip("suite.skip", () => {});
  xit("top-level xit", () => {});
  xspecify("top-level xspecify", () => {});

  assert.strictEqual(typeof run, "function");
});

// using `run` here makes it so this suite needs to be run with `--delay` mode.
// adding it here to test that `run` is correctly exported from mocha.
setTimeout(run, 0);
