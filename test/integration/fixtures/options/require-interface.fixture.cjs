"use strict";

var assert = require("node:assert");
var { describe, it, suite, test } = require("../../../../index");

assert.strictEqual(global.describe, undefined);
assert.strictEqual(global.it, undefined);
assert.strictEqual(global.suite, undefined);
assert.strictEqual(global.test, undefined);

describe("require interface", function () {
  suite("cjs", function () {
    it("runs bdd-style tests", function () {});
    test("runs tdd-style tests", function () {});
  });
});
