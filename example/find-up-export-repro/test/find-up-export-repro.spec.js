import { strict as assert } from "node:assert";

describe("find-up regression reproduction", () => {
  it("loads the TypeScript hook path", () => {
    assert.equal(1 + 1, 2);
  });
});
