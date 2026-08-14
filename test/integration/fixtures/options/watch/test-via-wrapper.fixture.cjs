"use strict";

const assert = require("node:assert");
const { getItems } = require("./lib/wrapper");

describe("mochaHooks watch state", function () {
  it("should see items initialized by mochaHooks", function () {
    assert.deepStrictEqual(getItems(), ["testItem1", "testItem2"]);
  });
});
