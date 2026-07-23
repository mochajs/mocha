"use strict";

var assert = require("node:assert");
var { describe, it, suite } = require("../../../../../index");

assert.strictEqual(global.describe, undefined);
assert.strictEqual(global.it, undefined);
assert.strictEqual(global.suite, undefined);

describe("require interface from config", function () {
  suite("config", function () {
    it("uses the require interface from rc files", function () {});
  });
});
