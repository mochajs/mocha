import assert from "node:assert";
import {
  context,
  describe,
  it,
  specify,
  suite,
  test,
  xcontext,
  xspecify,
} from "../../../../index.js";

assert.strictEqual(globalThis.describe, undefined);
assert.strictEqual(globalThis.it, undefined);
assert.strictEqual(globalThis.suite, undefined);
assert.strictEqual(globalThis.test, undefined);
assert.strictEqual(context, describe);
assert.strictEqual(xcontext, describe.skip);
assert.strictEqual(specify, it);
assert.strictEqual(xspecify, it.skip);

describe("require interface", function () {
  context("esm aliases", function () {
    specify("runs alias-style imports", function () {});
    xspecify("stays pending", function () {});
  });

  xcontext("esm pending suite", function () {});

  suite("esm", function () {
    it("runs bdd-style tests", function () {});
    test("runs tdd-style tests", function () {});
  });
});
