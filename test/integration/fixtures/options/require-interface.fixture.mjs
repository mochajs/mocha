import assert from "node:assert";
import { describe, it, suite, test } from "../../../../index.js";

assert.strictEqual(globalThis.describe, undefined);
assert.strictEqual(globalThis.it, undefined);
assert.strictEqual(globalThis.suite, undefined);
assert.strictEqual(globalThis.test, undefined);

describe("require interface", function () {
  suite("esm", function () {
    it("runs bdd-style tests", function () {});
    test("runs tdd-style tests", function () {});
  });
});
